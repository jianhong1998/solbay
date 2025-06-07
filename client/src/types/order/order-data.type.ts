import { OrderStatus } from '@/enums/order/order-status.constant';

export type IOrderSummaryData = {
  uuid: string;
  totalAmountInMicroUsdc: number;
  quantity: number;
  status: OrderStatus;
  product: {
    uuid: string;
    name: string;
    description: string;
    isPublish: boolean;
    priceInMicroUsdc: number;
    availableQuantity: number;
    seller: {
      id: string;
      name: string;
    };
  };
};
