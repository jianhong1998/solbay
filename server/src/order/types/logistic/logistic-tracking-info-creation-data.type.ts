import { LogisticTrackingInfoModel } from 'src/order/models/logistic-tracking-info.model';

export type ILogisticTrackingInfoCreationData = Omit<
  LogisticTrackingInfoModel,
  'uuid'
>;
