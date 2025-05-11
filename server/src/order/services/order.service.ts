import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { ProductModel } from 'src/product/models/product.model';
import { ProductService } from 'src/product/services/product.service';
import { EntityManager } from 'typeorm';

import { OrderModel } from '../models/order.model';
import { ILogisticInfoCreationData } from '../types/logistic/logistic-info-creation-data.type';
import { IOrderModelCreationData } from '../types/order-model-creation-data.type';
import { LogisticInfoDBUtil } from '../utils/logistic-info-db.util';
import { OrderDBUtil } from '../utils/order-db.util';
import { OrderHelperUtil } from '../utils/order-helper.util';

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
    private readonly orderHelper: OrderHelperUtil,
    private readonly productService: ProductService,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  public async createOrder(params: {
    entityManager?: EntityManager;
    data: ICreateOrderData;
  }): Promise<OrderModel> {
    const {
      data: { logisticInfo, quantity, product },
    } = params;
    const entityManager = params.entityManager ?? this.entityManager;

    /* STEP: Verify if product available */

    const totalAmountInMicroUsdc = this.orderHelper.calculateTotalPrice({
      product,
      quantity,
    });

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

      return createdOrder;
    });
  }
}
