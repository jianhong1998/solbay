import { FC, useMemo } from 'react';

import { OrderStatus } from '@/enums/order/order-status.constant';

type OrderStatusBadgeProps = {
  status: OrderStatus;
  style?: 'contained' | 'outlined';
};

export const OrderStatusBadge: FC<OrderStatusBadgeProps> = ({
  status,
  style = 'contained',
}) => {
  const displayMap = useMemo(() => {
    return new Map<OrderStatus, { label: string; bgColor: string }>([
      [
        OrderStatus.PENDING_PAYMENT,
        { label: 'Pending Payment', bgColor: 'badge-warning' },
      ],
      [
        OrderStatus.PENDING_SELLER_SHIP_OUT,
        { label: 'Waiting Seller Shipment', bgColor: 'badge-info' },
      ],
      [
        OrderStatus.DELIVERY_IN_PROGRESS,
        { label: 'Delivery in Progress', bgColor: 'badge-info' },
      ],
      [
        OrderStatus.ITEM_RECEIVED,
        { label: 'Completed', bgColor: 'badge-success' },
      ],
      [
        OrderStatus.ORDER_CANCELLED_BY_BUYER,
        { label: 'Buyer Cancelled', bgColor: 'badge-error' },
      ],
      [
        OrderStatus.ORDER_CANCELLED_BY_SELLER,
        { label: 'Seller Cancelled', bgColor: 'badge-error' },
      ],
      [
        OrderStatus.ORDER_CANCELLED_BY_SYSTEM,
        { label: 'System Cancelled', bgColor: 'badge-error' },
      ],
    ]);
  }, []);
  const badgeDisplay = useMemo(
    () =>
      displayMap.get(status) ?? { label: 'Invalid', bgColor: 'badge-ghost' },
    [status, displayMap],
  );

  return (
    <div
      className={`badge p-3 font-semibold ${style === 'outlined' ? 'badge-outline' : ''} ${badgeDisplay.bgColor}`}
    >
      {badgeDisplay.label}
    </div>
  );
};
