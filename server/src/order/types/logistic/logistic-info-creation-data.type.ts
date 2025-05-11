import { LogisticInfoModel } from 'src/order/models/logistic-info.model';

export type ILogisticInfoCreationData = Omit<
  LogisticInfoModel,
  'uuid' | 'logisticTrackingInfo'
>;
