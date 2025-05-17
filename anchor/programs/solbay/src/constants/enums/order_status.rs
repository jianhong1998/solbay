#[derive(Debug)]
pub enum OrderStatus {
  PendingSellerShipOut,
  // DeliveryInProgress,
  // ItemReceived,
  // OrderCancelledBySystem,
  // OrderCancelledBySeller,
  // OrderCancelledByBuyer,
  Invalid,
}

impl OrderStatus {
  // Optional: Convert enum variants to string representations
  pub fn to_str(&self) -> String {
    match self {
      OrderStatus::PendingSellerShipOut => String::from("pending_seller_ship_out"),
      // OrderStatus::DeliveryInProgress => String::from("delivery_in_progress"),
      // OrderStatus::ItemReceived => String::from("item_received"),
      // OrderStatus::OrderCancelledBySystem => String::from("order_cancelled_by_system"),
      // OrderStatus::OrderCancelledBySeller => String::from("order_cancelled_by_seller"),
      // OrderStatus::OrderCancelledByBuyer => String::from("order_cancelled_by_buyer"),
      OrderStatus::Invalid => String::from("invalid_status"),
    }
  }

  pub fn from_str(status_string: &str) -> OrderStatus {
    match status_string {
      "pending_seller_ship_out" => OrderStatus::PendingSellerShipOut,
      // "delivery_in_progress" => OrderStatus::DeliveryInProgress,
      // "item_received" => OrderStatus::ItemReceived,
      // "order_cancelled_by_system" => OrderStatus::OrderCancelledBySystem,
      // "order_cancelled_by_seller" => OrderStatus::OrderCancelledBySeller,
      // "order_cancelled_by_buyer" => OrderStatus::OrderCancelledByBuyer,
      _ => OrderStatus::Invalid,
    }
  }
}
