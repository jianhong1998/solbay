import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  NotFoundException,
  Post,
  Query,
} from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { User } from 'src/common/decorators';
import { LoggerUtil } from 'src/common/utils/logger.util';
import { ProductService } from 'src/product/services/product.service';
import { UserModel } from 'src/user/models/user.model';
import { SellerService } from 'src/user/services/seller.service';
import { EntityManager } from 'typeorm';

import { CheckoutReqDTO, CheckoutResDTO } from '../dtos/place-order.dto';
import { OrderModel } from '../models/order.model';
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
  ): Promise<{ orders: OrderModel[] }> {
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
      return { orders };
    }

    logger.log(`Fetching orders as buyer for user: ${user.uuid}`);
    const orders = await this.orderService.getOrdersByBuyer({ buyer: user });

    return { orders };
  }
}
