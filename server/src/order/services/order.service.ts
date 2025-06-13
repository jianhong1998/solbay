import { Program } from '@coral-xyz/anchor';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import {
  BlockhashWithExpiryBlockHeight,
  PublicKey,
  VersionedTransaction,
} from '@solana/web3.js';
import { UUID } from 'crypto';
import { isAfter } from 'date-fns';
import { SOLBAY_PLATFORM_CODE } from 'src/common/constants';
import { DateTimeFormat } from 'src/common/constants/format-string';
import { DateTimeHelper } from 'src/common/helpers/datetime.helper';
import { UuidHelper } from 'src/common/helpers/uuid.helper';
import { LoggerUtil } from 'src/common/utils/logger.util';
import { Solbay } from 'src/contract/src';
import { OrderOnChainDataFetchingUtil } from 'src/on-chain-program/utils/order-on-chain-data-fetching.util';
import { OrderOnChainDataHelperUtil } from 'src/on-chain-program/utils/order-on-chain-data-helper.util';
import { ProductModel } from 'src/product/models/product.model';
import { ProductService } from 'src/product/services/product.service';
import { AccountHelper } from 'src/solana-connection/helpers/account.helper';
import { UsdcHelper } from 'src/solana-connection/helpers/usdc.helper';
import { ConnectionUtil } from 'src/solana-connection/utils/connection.util';
import { TransactionUtil } from 'src/solana-connection/utils/transaction.util';
import { SellerModel } from 'src/user/models/seller.model';
import { UserModel } from 'src/user/models/user.model';
import { SellerDBUtil } from 'src/user/utils/sellerDB.util';
import { UserDBUtil } from 'src/user/utils/userDB.util';
import { EntityManager, In } from 'typeorm';

import { OrderStatus } from '../enums/order-status.enum';
import { OrderModel } from '../models/order.model';
import { ILogisticInfoCreationData } from '../types/logistic/logistic-info-creation-data.type';
import { ILogisticTrackingInfoCreationData } from '../types/logistic/logistic-tracking-info-creation-data.type';
import { IOrderModelCreationData } from '../types/order-model-creation-data.type';
import { OrderWithStatus } from '../types/order-with-status.type';
import { LogisticInfoDBUtil } from '../utils/logistic-info-db.util';
import { LogisticTrackingInfoDBUtil } from '../utils/logistic-tracking-info-db.util';
import { OrderDBUtil } from '../utils/order-db.util';
import { OrderHelperUtil } from '../utils/order-helper.util';
import { TempOrderDBUtil } from '../utils/temp-order-db.util';

type ICreateOrderData = {
  product: ProductModel;
  quantity: number;
  logisticInfo: ILogisticInfoCreationData;
};

@Injectable()
export class OrderService {
  private readonly program: Program<Solbay>;

  constructor(
    private readonly orderDBUtil: OrderDBUtil,
    private readonly logisticInfoDBUtil: LogisticInfoDBUtil,
    private readonly logisticTrackingInfoDBUtil: LogisticTrackingInfoDBUtil,
    private readonly sellerDBUtil: SellerDBUtil,
    private readonly userDBUtil: UserDBUtil,
    private readonly tempOrderDBUtil: TempOrderDBUtil,
    private readonly orderHelper: OrderHelperUtil,
    private readonly loggerUtil: LoggerUtil,
    private readonly productService: ProductService,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {
    this.program = ConnectionUtil.getProgram();
  }

  public async createOrder(params: {
    entityManager?: EntityManager;
    data: ICreateOrderData;
    buyer: UserModel;
  }): Promise<OrderModel> {
    const {
      data: { logisticInfo, quantity, product },
      buyer,
    } = params;
    const entityManager = params.entityManager ?? this.entityManager;

    /* STEP: Verify if product available */

    const totalAmountInMicroUsdc = this.orderHelper.calculateTotalPrice({
      product,
      quantity,
    });

    const isBuyerHavingSufficientFund = await this.checkBuyerUsdcBalance(
      new PublicKey(buyer.publicKey),
      totalAmountInMicroUsdc,
    );

    if (!isBuyerHavingSufficientFund)
      throw new BadRequestException('Insufficient fund');

    /* STEP: create order and deduct available quantity from the database*/
    return await entityManager.transaction(async (manager) => {
      /* Deduct product available quantity */
      await this.productService.reserveProduct({
        productId: product.uuid,
        quantity,
        entityManager: manager,
      });

      const createdLogisticInfo = await this.logisticInfoDBUtil.create({
        creationData: logisticInfo,
        entityManager: manager,
      });

      const orderCreationData: IOrderModelCreationData = {
        product,
        logisticInfo: createdLogisticInfo,
        quantity,
        totalAmountInMicroUsdc,
      };

      const createdOrder = await this.orderDBUtil.create({
        creationData: orderCreationData,
        entityManager: manager,
      });

      await this.tempOrderDBUtil.create({
        creationData: {
          buyer,
          order: createdOrder,
        },
        entityManager: manager,
      });

      return createdOrder;
    });
  }

  public async getOrdersBySeller(params: {
    userId: UUID;
    entityManager?: EntityManager;
  }): Promise<OrderWithStatus[]> {
    const { userId } = params;
    const entityManager = params.entityManager ?? this.entityManager;

    const seller = await this.sellerDBUtil.getOne({
      criterial: {
        user: {
          uuid: userId,
        },
      },
      relation: {
        user: true,
      },
      entityManager,
      withDeleted: true,
    });

    if (!seller) {
      throw new ForbiddenException('Cannot access seller resources');
    }

    const orders = await this.orderDBUtil.getAll({
      criterial: {
        product: {
          seller: {
            uuid: seller.uuid,
          },
        },
      },
      relation: {
        product: {
          seller: true,
        },
      },
      entityManager,
    });

    return Promise.all(
      orders.map(async (order) => await OrderWithStatus.new(order)),
    );
  }

  public async getOrdersByBuyer(params: {
    buyer: UserModel;
    entityManager?: EntityManager;
  }): Promise<OrderWithStatus[]> {
    const { buyer } = params;
    const entityManager = params.entityManager ?? this.entityManager;

    const buyerPublicKey = new PublicKey(buyer.publicKey);

    const onchainOrders =
      await OrderOnChainDataFetchingUtil.getOrderByBuyerPublicKey(
        buyerPublicKey,
      );

    const onchainOrderMap = new Map(
      onchainOrders.map((order) => [order.orderId, order]),
    );

    const dbOrders = await this.orderDBUtil.getAll({
      criterial: {
        uuid: In([...onchainOrderMap.keys()]),
      },
      relation: {
        logisticInfo: false,
      },
      entityManager,
    });

    const tempOrders = await this.tempOrderDBUtil.getAll({
      criterial: {
        buyer: {
          uuid: buyer.uuid,
        },
      },
      relation: {
        order: {
          logisticInfo: false,
        },
      },
      entityManager,
    });

    const orderPromises = [
      ...tempOrders.map((tempOrder) => tempOrder.order),
      ...dbOrders,
    ].map(async (order) => await OrderWithStatus.new(order));

    return await Promise.all(orderPromises);
  }

  /**
   * Get order by orderId.
   *
   * @note Only seller and buyer can get order.
   * @throw ForbiddenException if user is not seller or buyer.
   * @throw NotFoundException if order not found.
   */
  public async getOrderByOrderId(params: {
    orderId: UUID;
    user: UserModel;
    withDeleted?: boolean;
    withProduct?: boolean;
    withLogisticTrackingInfo?: boolean;
    entityManager?: EntityManager;
  }): Promise<OrderModel | null> {
    const {
      orderId,
      user,
      withDeleted = false,
      withProduct = false,
      withLogisticTrackingInfo = false,
    } = params;
    const entityManager = params.entityManager ?? this.entityManager;

    const order = await this.orderDBUtil.getOne({
      criterial: {
        uuid: orderId,
      },
      relation: {
        logisticInfo: {
          logisticTrackingInfo: withLogisticTrackingInfo,
        },
        product: withProduct,
      },
      withDeleted,
      entityManager,
    });

    const canUserAccess = await this.verifyIfUserCanGetOrder({
      orderId,
      userId: user.uuid,
      entityManager,
    });

    if (!canUserAccess)
      throw new ForbiddenException(
        'You do not have permission to access this data',
      );

    return order;
  }

  public async markOrderDeliveryInProgress(params: {
    orderId: UUID;
    logisticTrackingInfoCreationData: ILogisticTrackingInfoCreationData;
    seller: SellerModel;
    entityManager?: EntityManager;
  }): Promise<OrderModel> {
    const logger = this.loggerUtil.createLogger(
      'MarkOrderDeliveryInProgressService',
    );

    const { logisticTrackingInfoCreationData, orderId, seller } = params;
    const entityManager = params.entityManager ?? this.entityManager;

    const now = new Date();

    if (!isAfter(logisticTrackingInfoCreationData.estimatedDeliverDate, now))
      throw new BadRequestException(
        `Estimate deliver date must be after today ${DateTimeHelper.format(now, DateTimeFormat.DATE_ONLY)}`,
      );

    const { updatedOrder } = await entityManager.transaction(
      async (manager) => {
        const order = await this.orderDBUtil.getOne({
          criterial: {
            uuid: orderId,
          },
          relation: {
            logisticInfo: {
              logisticTrackingInfo: true,
            },
            product: {
              seller: true,
            },
          },
          entityManager: manager,
        });

        if (!order)
          throw new NotFoundException(`Order (${orderId}) not found.`);

        if (!order.product || !order.product.seller) {
          logger.error(`Order (${orderId}) seller is not fetched.`);
          throw new Error('Order seller not found.');
        }

        if (order.product.seller.uuid !== seller.uuid)
          throw new ForbiddenException(
            'You are not allowed to update this order.',
          );

        if (!order.logisticInfo) {
          logger.error(`Order (${orderId}) logistic info is not fetched`);
          throw new Error('Order logistic info not found.');
        }

        if (order.logisticInfo?.logisticTrackingInfo)
          throw new ConflictException(
            `Order is already marked as delivery in progress before.`,
          );

        const createdLogisticTrackingInfo =
          await this.logisticTrackingInfoDBUtil.create({
            creationData: logisticTrackingInfoCreationData,
            entityManager: manager,
          });

        order.logisticInfo.logisticTrackingInfo = createdLogisticTrackingInfo;

        await this.logisticInfoDBUtil.saveUpdate({
          dataArray: [order.logisticInfo],
          entityManager: manager,
        });

        const updatedOrder = await this.orderDBUtil.getOne({
          criterial: {
            uuid: orderId,
          },
          relation: {
            logisticInfo: {
              logisticTrackingInfo: true,
            },
          },
          entityManager: manager,
        });

        if (!updatedOrder) {
          logger.error(
            `Order (${orderId}) not found after logistic tracking info updated.`,
          );
          throw new NotFoundException(`Order (${orderId}) not found.`);
        }

        return { updatedOrder };
      },
    );

    return updatedOrder;
  }

  public async createMarkOrderDelieryInProgressTransaction(params: {
    orderId: UUID;
    sellerUser: UserModel;
    entityManager?: EntityManager;
  }): Promise<{
    transaction: VersionedTransaction;
    latestBlockhash: BlockhashWithExpiryBlockHeight;
  } | null> {
    const { orderId, sellerUser } = params;
    const entityManager = params.entityManager ?? this.entityManager;
    const logger = this.loggerUtil.createLogger(
      'CreateMarkOrderDeliveryInProgressTransaction',
    );

    const order = await this.orderDBUtil.getOne({
      criterial: {
        uuid: orderId,
      },
      relation: {
        product: {
          seller: true,
        },
      },
      entityManager,
    });

    const seller = await this.sellerDBUtil.getOne({
      criterial: {
        user: {
          uuid: sellerUser.uuid,
        },
      },
      entityManager,
    });

    if (!order) throw new NotFoundException('Order not found');

    if (!seller || !order.product?.seller)
      throw new NotFoundException('Seller not found');

    if (seller?.uuid !== order.product?.seller?.uuid)
      new ForbiddenException('You are not allowed to update this order.');

    const orderOnchainDataPublicKey =
      OrderOnChainDataHelperUtil.generateOrderPdaPublicKey(orderId);
    const orderOnchainData =
      await OrderOnChainDataFetchingUtil.getOrderByOrderPublicKey(
        orderOnchainDataPublicKey,
      );

    if (!orderOnchainData) {
      logger.error(
        `Seller trying to create transaction to mark order ${orderId} as delivery in progress but onchain data (${orderOnchainDataPublicKey.toBase58()}) is not found.`,
      );
      throw new BadRequestException('Order is not paid yet');
    }

    if (orderOnchainData.status !== OrderStatus.PENDING_SELLER_SHIP_OUT) {
      return null;
    }

    const orderIdBytes = Array.from(UuidHelper.convertUuidToBytes(order.uuid));
    const sellerPublicKey = new PublicKey(sellerUser.publicKey);
    const usdcMintPublicKey = UsdcHelper.getUsdcMintPublicKey();

    const instruction = await this.program.methods
      .deliveryInProgress(orderIdBytes, SOLBAY_PLATFORM_CODE)
      .accounts({
        mint: usdcMintPublicKey,
        seller: sellerPublicKey,
      })
      .instruction();

    return await TransactionUtil.createTransaction({
      instructions: [instruction],
      payerPublicKey: sellerPublicKey,
    });
  }

  public async createReceiveOrderTransaction(params: {
    orderId: UUID;
    user: UserModel;
    entityManager?: EntityManager;
  }): Promise<{
    transaction: VersionedTransaction;
    latestBlockhash: BlockhashWithExpiryBlockHeight;
  }> {
    const { orderId, user } = params;
    const entityManager = params.entityManager ?? this.entityManager;
    const errorMessageForOrderNotReady = `Order (${orderId}) status is not ready to be marked as received before.`;

    /* Validate if order is ready to be marked as received */

    const isTempOrder = await this.tempOrderDBUtil.has({
      criterial: {
        order: { uuid: orderId },
      },
      relation: {
        order: true,
      },
      entityManager,
    });

    if (isTempOrder)
      throw new BadRequestException(errorMessageForOrderNotReady);

    const order = await this.orderDBUtil.getOne({
      criterial: {
        uuid: orderId,
      },
      relation: {
        product: {
          seller: true,
        },
      },
      entityManager,
    });

    if (!order) throw new NotFoundException(`Order (${orderId}) not found.`);

    const orderWithStatus = await OrderWithStatus.new(order);

    if (orderWithStatus.status === OrderStatus.ITEM_RECEIVED)
      throw new ConflictException('Order is already marked as received.');

    if (orderWithStatus.status !== OrderStatus.DELIVERY_IN_PROGRESS)
      throw new BadRequestException(errorMessageForOrderNotReady);

    /* Prepare data for transaction creation */

    if (!orderWithStatus.product?.seller)
      throw new Error('Seller not fetched in order');

    const seller = await this.sellerDBUtil.getOne({
      criterial: {
        uuid: orderWithStatus.product.seller.uuid,
      },
      relation: {
        user: true,
      },
      entityManager,
    });

    if (!seller?.user) throw new Error('User is not fetched in seller data');

    const orderIdBytes = Array.from(UuidHelper.convertUuidToBytes(orderId));
    const buyerKey = new PublicKey(user.publicKey);
    const sellerKey = new PublicKey(seller.user.publicKey);

    /* Create transaction */

    const instruction = await this.program.methods
      .receiveOrder(orderIdBytes, SOLBAY_PLATFORM_CODE)
      .accounts({
        mint: UsdcHelper.getUsdcMintPublicKey(),
        seller: sellerKey,
        buyer: buyerKey,
      })
      .instruction();

    return await TransactionUtil.createTransaction({
      instructions: [instruction],
      payerPublicKey: buyerKey,
    });
  }

  private async checkBuyerUsdcBalance(
    buyerPublicKey: PublicKey,
    minAmountInMicroUsdc: number,
  ): Promise<boolean> {
    const usdcMint = UsdcHelper.getUsdcMintPublicKey();

    const tokenAccountPublicKey =
      AccountHelper.generateAssociatedTokenAccountPublicKey(
        buyerPublicKey,
        usdcMint,
      );

    const tokenAccount = await AccountHelper.getTokenAccount(
      tokenAccountPublicKey,
    );

    if (!tokenAccount) return false;

    const balance = Number(tokenAccount.amount);

    return balance >= minAmountInMicroUsdc;
  }

  private async verifyIfUserCanGetOrder(params: {
    userId: UUID;
    orderId: UUID;
    entityManager?: EntityManager;
  }): Promise<boolean> {
    const { orderId, userId } = params;
    const entityManager = params.entityManager ?? this.entityManager;

    const order = await this.orderDBUtil.getOne({
      criterial: { uuid: orderId },
      relation: {
        product: {
          seller: true,
        },
      },
      entityManager,
    });

    const tempOrder = await this.tempOrderDBUtil.getOne({
      criterial: {
        order: {
          uuid: orderId,
        },
      },
      relation: { buyer: true },
      entityManager,
    });

    if (!order) throw new NotFoundException('Order not found.');
    if (!order.product) throw new Error('Order product is not fetched.');
    if (!order.product.seller)
      throw new Error('Seller for the product is not fetched.');

    const seller = await this.sellerDBUtil.getOne({
      criterial: {
        uuid: order.product.seller.uuid,
      },
      relation: {
        user: true,
      },
      entityManager,
    });

    if (!seller || !seller.user)
      throw new Error('Seller user account is not found!');

    const orderOnchainDataPublicKey =
      OrderOnChainDataHelperUtil.generateOrderPdaPublicKey(orderId);
    const orderOnchainData =
      await OrderOnChainDataFetchingUtil.getOrderByOrderPublicKey(
        orderOnchainDataPublicKey,
      );

    const isProductSeller = userId === seller.user.uuid;

    if (isProductSeller) return true;

    /* Verify if is Buyer */

    const user = await this.userDBUtil.getOne({
      criterial: {
        uuid: userId,
      },
      entityManager,
    });

    if (!user) throw new NotFoundException('User not found.');

    if (orderOnchainData)
      return user.publicKey === orderOnchainData.buyerPubkey.toBase58();

    if (tempOrder) return user.publicKey === tempOrder.buyer.publicKey;

    return false;
  }
}
