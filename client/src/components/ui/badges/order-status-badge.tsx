import { FC, useMemo } from 'react';

import { OrderStatus } from '@/enums/order/order-status.constant';

type OrderStatusBadgeProps = {
  status: OrderStatus;
  style?: 'contained' | 'outlined';
  sellerMode?: boolean;
};

export const OrderStatusBadge: FC<OrderStatusBadgeProps> = ({
  status,
  style = 'contained',
  sellerMode = false,
}) => {
  const displayMap = useMemo(() => {
    return new Map<
      OrderStatus,
      { label: string; bgColor: string; sellerModeBgColor: string }
    >([
      [
        OrderStatus.PENDING_PAYMENT,
        {
          label: 'Pending Payment',
          bgColor: 'badge-warning',
          sellerModeBgColor: 'badge-info',
        },
      ],
      [
        OrderStatus.PENDING_SELLER_SHIP_OUT,
        {
          label: 'Waiting Seller Shipment',
          bgColor: 'badge-info',
          sellerModeBgColor: 'badge-warning',
        },
      ],
      [
        OrderStatus.DELIVERY_IN_PROGRESS,
        {
          label: 'Delivery in Progress',
          bgColor: 'badge-info',
          sellerModeBgColor: 'badge-info',
        },
      ],
      [
        OrderStatus.ITEM_RECEIVED,
        {
          label: 'Completed',
          bgColor: 'badge-success',
          sellerModeBgColor: 'badge-success',
        },
      ],
      [
        OrderStatus.ORDER_CANCELLED_BY_BUYER,
        {
          label: 'Buyer Cancelled',
          bgColor: 'badge-error',
          sellerModeBgColor: 'badge-error',
        },
      ],
      [
        OrderStatus.ORDER_CANCELLED_BY_SELLER,
        {
          label: 'Seller Cancelled',
          bgColor: 'badge-error',
          sellerModeBgColor: 'badge-error',
        },
      ],
      [
        OrderStatus.ORDER_CANCELLED_BY_SYSTEM,
        {
          label: 'System Cancelled',
          bgColor: 'badge-error',
          sellerModeBgColor: 'badge-error',
        },
      ],
    ]);
  }, []);
  const badgeDisplay = useMemo(
    () =>
      displayMap.get(status) ?? {
        label: 'Invalid',
        bgColor: 'badge-ghost',
        sellerModeBgColor: 'badge-ghost',
      },
    [status, displayMap],
  );

  return (
    <div
      className={`badge p-3 font-semibold text-xs md:text-sm overflow-y-hidden overflow-x-scroll ${style === 'outlined' ? 'badge-outline' : ''} ${
        sellerMode ? badgeDisplay.sellerModeBgColor : badgeDisplay.bgColor
      }`}
    >
      {badgeDisplay.label}
    </div>
  );
};
