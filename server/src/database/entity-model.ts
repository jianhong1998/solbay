import { LogisticInfoModel } from 'src/order/models/logistic-info.model';
import { LogisticTrackingInfoModel } from 'src/order/models/logistic-tracking-info.model';
import { OrderModel } from 'src/order/models/order.model';
import { TempOrderModel } from 'src/order/models/temp-order.model';
import { ProductModel } from 'src/product/models/product.model';
import { SellerModel } from 'src/user/models/seller.model';
import { UserModel } from 'src/user/models/user.model';

export const ENTITY_MODELS = [
  UserModel,
  SellerModel,
  ProductModel,
  OrderModel,
  LogisticInfoModel,
  LogisticTrackingInfoModel,
  TempOrderModel,
];

export type ModelConstructorType = (typeof ENTITY_MODELS)[number];
