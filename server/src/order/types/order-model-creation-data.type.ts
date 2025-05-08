import { OrderModel } from '../models/order.model';

export type IOrderModelCreationData = Omit<OrderModel, 'uuid'>;
