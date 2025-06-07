import { FC } from 'react';

import { IOrderSummaryData } from '@/types/order/order-data.type';

import { OrderListItem } from './order-list-item';

type OrderListProps = {
  orders: IOrderSummaryData[];
};

export const OrderList: FC<OrderListProps> = ({ orders }) => {
  return (
    <ul className="flex flex-col gap-3">
      {orders.map((order) => (
        <OrderListItem
          key={order.uuid}
          order={order}
        />
      ))}
    </ul>
  );
};
