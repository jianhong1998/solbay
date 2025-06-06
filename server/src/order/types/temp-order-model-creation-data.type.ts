import { TempOrderModel } from '../models/temp-order.model';

export type ITempOrderModelCreationData = Omit<TempOrderModel, 'uuid'>;
