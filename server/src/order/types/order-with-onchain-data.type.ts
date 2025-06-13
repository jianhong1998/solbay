import { PublicKey } from '@solana/web3.js';
import { UUID } from 'crypto';
import { OrderOnChainDataFetchingUtil } from 'src/on-chain-program/utils/order-on-chain-data-fetching.util';
import { ProductModel } from 'src/product/models/product.model';

import { OrderStatus } from '../enums/order-status.enum';
import { LogisticInfoModel } from '../models/logistic-info.model';
import { OrderModel } from '../models/order.model';
import {
  IOrderOnchainData,
  OrderOnchainData,
} from './on-chain-data/order-on-chain-data.type';

type IOrderModel = typeof OrderModel.prototype;

export class OrderWithOnchainData implements IOrderModel {
  readonly uuid: UUID;
  readonly totalAmountInMicroUsdc: number;
  readonly onChainDataPubkey: string | null;
  readonly quantity: number;
  readonly status: OrderStatus;
  readonly product?: ProductModel;
  readonly logisticInfo?: LogisticInfoModel;
  readonly orderOnchainData: OrderOnchainData | null;

  private constructor(
    dbOrder: OrderModel,
    onChainOrder: IOrderOnchainData | null,
  ) {
    this.status = onChainOrder?.status ?? OrderStatus.PENDING_PAYMENT;
    this.orderOnchainData = onChainOrder;

    this.uuid = dbOrder.uuid;
    this.totalAmountInMicroUsdc = dbOrder.totalAmountInMicroUsdc;

    this.onChainDataPubkey = dbOrder.onChainDataPubkey;
    this.quantity = dbOrder.quantity;
    this.product = dbOrder.product;
    this.logisticInfo = dbOrder.logisticInfo;
  }

  public static async new(order: OrderModel): Promise<OrderWithOnchainData> {
    if (!order.onChainDataPubkey) return new OrderWithOnchainData(order, null);

    const onchainOrderPublicKey = new PublicKey(order.onChainDataPubkey);

    const onchainOrderData =
      await OrderOnChainDataFetchingUtil.getOrderByOrderPublicKey(
        onchainOrderPublicKey,
      );

    return new OrderWithOnchainData(order, onchainOrderData);
  }
}
