export const OrderStatus = Object.freeze({
  PENDING_PAYMENT: 'pending_payment',
  PENDING_SELLER_SHIP_OUT: 'pending_seller_ship_out',
  DELIVERY_IN_PROGRESS: 'delivery_in_progress',
  ITEM_RECEIVED: 'item_received',
  ORDER_CANCELLED_BY_SYSTEM: 'order_cancelled_by_system',
  ORDER_CANCELLED_BY_SELLER: 'order_cancelled_by_seller',
  ORDER_CANCELLED_BY_BUYER: 'order_cancelled_by_buyer',
} as const);

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];
