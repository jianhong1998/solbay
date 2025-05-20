import {
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { User } from 'src/common/decorators';
import { LoggerUtil } from 'src/common/utils/logger.util';
import { ProductService } from 'src/product/services/product.service';
import { TransactionUtil } from 'src/solana-connection/utils/transaction.util';
import { UserModel } from 'src/user/models/user.model';
import { SellerService } from 'src/user/services/seller.service';
import { EntityManager } from 'typeorm';

import { CheckoutReqDTO, CheckoutResDTO } from '../dtos/place-order.dto';
import { OrderService } from '../services/order.service';
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
    const { productId, logisticInfo, quantity } = reqBody;
    const logger = this.loggerUtil.createLogger('Checkout Endpoint');

    const {
      order,
      orderStatus,
      transaction: { transaction },
    } = await this.entityManager.transaction(async (manager) => {
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
        logger.warn(
          `Buyer (${buyer.uuid}) is trying to checkout a non-published product (${productId})`,
        );
        throw new NotFoundException('Product not found.');
      }

      const order = await this.orderService.createOrder({
        data: {
          logisticInfo,
          product,
          quantity,
        },
        entityManager: manager,
      });

      const orderStatus = await this.orderHelperUtil.getOrderStatus(order);

      if (!product.seller) throw new Error('Seller is not fetched in product');

      const seller = await this.sellerService.getSellerById({
        entityManager: manager,
        sellerId: product.seller.uuid,
        withUser: true,
      });

      if (!seller || !seller.user) throw new Error('Seller not found');

      // TODO: Create transaction with payment instruction
      const versionedTransaction =
        await this.orderHelperUtil.generatePaymentTransaction(
          order,
          buyer,
          seller.user,
        );

      return { order, orderStatus, transaction: versionedTransaction };
    });

    return new CheckoutResDTO({
      order,
      orderStatus,
      serializedTransaction: TransactionUtil.serializeTransaction(transaction),
    });
  }
}
