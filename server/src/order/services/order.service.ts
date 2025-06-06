import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { PublicKey } from '@solana/web3.js';
import { UUID } from 'crypto';
import { OrderOnChainDataFetchingUtil } from 'src/on-chain-program/utils/order-on-chain-data-fetching.util';
import { ProductModel } from 'src/product/models/product.model';
import { ProductService } from 'src/product/services/product.service';
import { AccountHelper } from 'src/solana-connection/helpers/account.helper';
import { UsdcHelper } from 'src/solana-connection/helpers/usdc.helper';
import { UserModel } from 'src/user/models/user.model';
import { SellerDBUtil } from 'src/user/utils/sellerDB.util';
import { EntityManager, In } from 'typeorm';

import { OrderModel } from '../models/order.model';
import { ILogisticInfoCreationData } from '../types/logistic/logistic-info-creation-data.type';
import { IOrderModelCreationData } from '../types/order-model-creation-data.type';
import { OrderWithStatus } from '../types/order-with-status.type';
import { LogisticInfoDBUtil } from '../utils/logistic-info-db.util';
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
  constructor(
    private readonly orderDBUtil: OrderDBUtil,
    private readonly logisticInfoDBUtil: LogisticInfoDBUtil,
    private readonly sellerDBUtil: SellerDBUtil,
    private readonly tempOrderDBUtil: TempOrderDBUtil,
    private readonly orderHelper: OrderHelperUtil,
    private readonly productService: ProductService,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

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
  }): Promise<OrderModel[]> {
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

    return orders;
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

    const orders = [
      ...tempOrders.map((tempOrder) => tempOrder.order),
      ...dbOrders,
    ].map((order) => {
      const onchainOrder = onchainOrderMap.get(order.uuid);
      return new OrderWithStatus(order, onchainOrder);
    });

    return orders;
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
}
