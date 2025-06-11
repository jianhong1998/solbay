import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { UUID } from 'crypto';
import { User } from 'src/common/decorators';
import { IsSeller } from 'src/common/decorators/is-seller.decorator';
import { Seller } from 'src/common/decorators/seller.decorator';
import { LoggerUtil } from 'src/common/utils/logger.util';
import { OrderOnChainDataFetchingUtil } from 'src/on-chain-program/utils/order-on-chain-data-fetching.util';
import { OrderOnChainDataHelperUtil } from 'src/on-chain-program/utils/order-on-chain-data-helper.util';
import { ProductService } from 'src/product/services/product.service';
import { SellerModel } from 'src/user/models/seller.model';
import { UserModel } from 'src/user/models/user.model';
import { SellerService } from 'src/user/services/seller.service';
import { EntityManager } from 'typeorm';

import { GenerateReceiveOrderTransactionResDTO } from '../dtos/generate-receive-order-transaction.dto';
import { GetAllOrderResDTO, OrderResDTO } from '../dtos/get-order.dto';
import { CheckoutReqDTO, CheckoutResDTO } from '../dtos/place-order.dto';
import {
  UpdateOrderLogisticTrackingInfoReqDTO,
  UpdateOrderLogisticTrackingInfoResDTO,
} from '../dtos/update-order-logistic-tracking-info.dto';
import { OrderService } from '../services/order.service';
import { OrderWithStatus } from '../types/order-with-status.type';
import { OrderHelperUtil } from '../utils/order-helper.util';

@Controller('/order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly productService: ProductService,
    private readonly loggerUtil: LoggerUtil,
    private readonly orderHelperUtil: OrderHelperUtil,
    private readonly sellerService: SellerService,

    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  @Post('/')
  @HttpCode(200)
  public async checkout(
    @Body() reqBody: CheckoutReqDTO,
    @User() buyer: UserModel,
  ): Promise<CheckoutResDTO> {
    const { logisticInfo, productQuantities } = reqBody;
    const logger = this.loggerUtil.createLogger('Checkout Endpoint');

    // TODO: (Enhancement) Handle multiple product checkout
    const [{ productId, quantity }] = productQuantities;

    const { order, orderStatus } = await this.entityManager.transaction(
      async (manager) => {
        const product = await this.productService.getProductDetails({
          criterial: {
            uuid: productId,
          },
          entityManager: manager,
        });

        if (!product) {
          logger.warn(
            `Buyer (${buyer.uuid}) is trying to checkout a non-existing product (${productId})`,
          );
          throw new NotFoundException('Product not found.');
        }

        if (!product.isPublish) {
          logger.error(
            `Buyer (${buyer.uuid}) is trying to checkout a non-published product (${productId})`,
          );
          throw new NotFoundException('Product not found.');
        }

        if (!product.seller)
          throw new Error('Seller is not fetched in product');

        const seller = await this.sellerService.getSellerById({
          entityManager: manager,
          sellerId: product.seller.uuid,
          withUser: true,
        });

        if (!seller || !seller.user) throw new Error('Seller not found');

        if (seller.user.uuid === buyer.uuid) {
          throw new BadRequestException(
            'Failed to checkout because this is your product.',
          );
        }

        const order = await this.orderService.createOrder({
          data: {
            logisticInfo,
            product,
            quantity,
          },
          entityManager: manager,
          buyer,
        });

        const orderStatus = await this.orderHelperUtil.getOrderStatus(order);

        return { order, orderStatus };
      },
    );

    return new CheckoutResDTO({
      orders: [order],
      orderStatus,
    });
  }

  @Get('/')
  @HttpCode(200)
  public async getOrders(
    @User() user: UserModel,
    @Query('asSeller') asSeller: string,
  ): Promise<GetAllOrderResDTO> {
    const logger = this.loggerUtil.createLogger('Get Orders Endpoint');
    logger.log(`Retrieving orders for user: ${user.uuid}`);

    const sellerMode = asSeller === 'true';

    const isSeller = await this.sellerService.isUserSeller({
      userId: user.uuid,
    });

    if (sellerMode && !isSeller) {
      logger.warn(
        `User ${user.uuid} is not a seller but requested seller orders.`,
      );
      throw new ForbiddenException(
        'User is not authorized to view seller orders.',
      );
    }

    if (sellerMode) {
      logger.log(`Fetching orders as seller for user: ${user.uuid}`);
      const orders = await this.orderService.getOrdersBySeller({
        userId: user.uuid,
        entityManager: this.entityManager,
      });
      return new GetAllOrderResDTO(orders);
    }

    logger.log(`Fetching orders as buyer for user: ${user.uuid}`);
    const orders = await this.orderService.getOrdersByBuyer({ buyer: user });

    return new GetAllOrderResDTO(orders);
  }

  @Get('/:orderId')
  @HttpCode(200)
  public async getOrder(
    @User() user: UserModel,
    @Seller() seller: SellerModel | undefined,
    @Param('orderId') orderId: UUID,
  ): Promise<OrderResDTO> {
    const entityManager = this.entityManager;

    const order = await this.orderService.getOrderByOrderId({
      orderId,
      user,
      entityManager,
      withProduct: true,
      withLogisticTrackingInfo: true,
    });

    if (!order)
      throw new NotFoundException(`Order (${orderId}) does not exist`);

    const orderWithStatus = await OrderWithStatus.new(order);

    return new OrderResDTO(orderWithStatus);
  }

  /**
   * Update order logistic tracking info and create transaction to mark onchain order status as delivery in progress.
   *
   * If order logistic tracking info already exist then will skip update data process.
   *
   * If order onchain data status is already marked as delivery in progress, will no generate transaction.
   *
   * @throws {ConflictException} If both order logistic tracking info and onchain data status already updated before
   */
  @Patch('/:orderId/delivery-in-progress')
  @IsSeller()
  @HttpCode(200)
  public async updateOrderLogisticTrackingInfo(
    @Param('orderId') orderId: UUID,
    @Body() reqBody: UpdateOrderLogisticTrackingInfoReqDTO,
    @Seller() seller: SellerModel,
    @User() sellerUser: UserModel,
  ) {
    const { logisticTrackingInfo } = reqBody;
    const logger = this.loggerUtil.createLogger(
      'Endpoint - UpdateOrderLogisticTrackingInfo',
    );

    const orderOnchainDataPublicKey =
      OrderOnChainDataHelperUtil.generateOrderPdaPublicKey(orderId);

    const orderOnchainData =
      await OrderOnChainDataFetchingUtil.getOrderByOrderPublicKey(
        orderOnchainDataPublicKey,
      );

    if (!orderOnchainData) {
      logger.error(
        `Seller trying to mark an order (${orderId}) as delivery in progress but onchain data (${orderOnchainDataPublicKey.toBase58()}) not found`,
      );
      throw new BadRequestException('Order is not paid yet');
    }

    const { order } = await this.entityManager.transaction(async (manager) => {
      const order = await this.orderService.getOrderByOrderId({
        orderId,
        user: sellerUser,
        entityManager: manager,
        withLogisticTrackingInfo: true,
        withProduct: true,
      });

      if (!order) throw new NotFoundException('Order not found.');

      if (order.logisticInfo?.logisticTrackingInfo) {
        return { order: null };
      }

      const updatedOrder = await this.orderService.markOrderDeliveryInProgress({
        orderId,
        seller,
        logisticTrackingInfoCreationData: logisticTrackingInfo,
        entityManager: manager,
      });

      return { order: updatedOrder };
    });

    const createTransactionResult =
      await this.orderService.createMarkOrderDelieryInProgressTransaction({
        entityManager: this.entityManager,
        orderId,
        sellerUser,
      });

    if (!order && !createTransactionResult)
      throw new ConflictException(
        'Order is already updated before for delivery in progress.',
      );

    const additionalMessage = order
      ? null
      : 'Order logistic tracking data no changed as it is updated before.';

    return new UpdateOrderLogisticTrackingInfoResDTO(
      createTransactionResult,
      additionalMessage,
    );
  }

  @Patch('/:orderId/receive')
  @HttpCode(200)
  public async generateReceiveOrderTransaction(
    @Param('orderId') orderId: UUID,
    @User() user: UserModel,
  ) {
    const { transaction, latestBlockhash } =
      await this.orderService.createReceiveOrderTransaction({
        orderId,
        user,
      });

    return new GenerateReceiveOrderTransactionResDTO(
      transaction,
      latestBlockhash,
    );
  }
}
