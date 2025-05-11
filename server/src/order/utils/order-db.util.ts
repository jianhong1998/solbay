import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseDBUtil } from 'src/common/base-classes/base-db-util';
import { EntityManager, Repository } from 'typeorm';

import { OrderModel } from '../models/order.model';
import { IOrderModelCreationData } from '../types/order-model-creation-data.type';

@Injectable()
export class OrderDBUtil extends BaseDBUtil<
  OrderModel,
  IOrderModelCreationData
> {
  constructor(
    @InjectRepository(OrderModel)
    orderRepo: Repository<OrderModel>,
  ) {
    super(OrderModel, orderRepo);
  }

  public async create(params: {
    creationData: IOrderModelCreationData;
    entityManager?: EntityManager;
  }): Promise<OrderModel> {
    const { entityManager, creationData: orderData } = params;
    const repo = entityManager?.getRepository(OrderModel) ?? this.repo;

    if (!orderData.product.uuid)
      throw new Error(`Product must be saved before can create order`);

    if (!orderData.logisticInfo.uuid)
      throw new Error(`LogisticInfo must be saved before can create order`);

    if (orderData.totalAmountInMicroUsdc <= 0)
      throw new Error(`Amount must be greater than 0`);

    if (orderData.quantity <= 0)
      throw new Error(`Quantity must be greater than 0`);

    const order = repo.create({
      totalAmountInMicroUsdc: orderData.totalAmountInMicroUsdc,
      quantity: orderData.quantity,
      product: orderData.product,
      logisticInfo: orderData.logisticInfo,
    });

    const savedOrder = await repo.save(order);

    return savedOrder;
  }
}
