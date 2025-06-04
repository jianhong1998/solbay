import { UUID } from 'crypto';
import { ProductModel } from 'src/product/models/product.model';

import { OrderStatus } from '../enums/order-status.enum';
import { LogisticInfoModel } from '../models/logistic-info.model';
import { OrderModel } from '../models/order.model';
import { IOnChainOrderData } from './on-chain-data/order-on-chain-data.type';

type IOrderModel = typeof OrderModel.prototype;

export class OrderWithStatus implements IOrderModel {
  readonly uuid: UUID;
  readonly totalAmountInMicroUsdc: number;
  readonly onChainDataPubkey: string | null;
  readonly quantity: number;
  readonly status: OrderStatus;
  readonly product?: ProductModel;
  readonly logisticInfo?: LogisticInfoModel;

  constructor(dbOrder: OrderModel, onChainOrder: IOnChainOrderData) {
    this.status = onChainOrder.status;

    this.uuid = dbOrder.uuid;
    this.totalAmountInMicroUsdc = dbOrder.totalAmountInMicroUsdc;
    this.onChainDataPubkey = dbOrder.onChainDataPubkey;
    this.quantity = dbOrder.quantity;
    this.product = dbOrder.product;
    this.logisticInfo = dbOrder.logisticInfo;
  }
}
