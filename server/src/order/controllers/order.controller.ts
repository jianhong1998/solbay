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

        if (!product.seller)
          throw new Error('Seller is not fetched in product');

        const seller = await this.sellerService.getSellerById({
          entityManager: manager,
          sellerId: product.seller.uuid,
          withUser: true,
        });

        if (!seller || !seller.user) throw new Error('Seller not found');

        return { order, orderStatus };
      },
    );

    return new CheckoutResDTO({
      orders: [order],
      orderStatus,
    });
  }
}
