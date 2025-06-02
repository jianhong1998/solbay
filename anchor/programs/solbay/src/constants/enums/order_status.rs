#[derive(Debug)]
#[allow(dead_code)]
pub enum OrderStatus {
  PendingSellerShipOut,
  DeliveryInProgress,
  ItemReceived,
  OrderCancelledBySystem,
  OrderCancelledBySeller,
  OrderCancelledByBuyer,
  Invalid,
}

#[allow(dead_code)]
impl OrderStatus {
  // Optional: Convert enum variants to string representations
  pub fn to_str(&self) -> String {
    match self {
      //JOB: create status - purchase initiated by buyer
      OrderStatus::PendingSellerShipOut => String::from("pending_seller_ship_out"),

      //JOB: update status - after seller triggers he has shipped out
      OrderStatus::DeliveryInProgress => String::from("delivery_in_progress"),

      //JOB: update status + release fund, order complete - buyer receives
      OrderStatus::ItemReceived => String::from("item_received"),

      //refunds
      OrderStatus::OrderCancelledBySystem => String::from("order_cancelled_by_system"),
      OrderStatus::OrderCancelledBySeller => String::from("order_cancelled_by_seller"),
      OrderStatus::OrderCancelledByBuyer => String::from("order_cancelled_by_buyer"),

      //placeholder
      OrderStatus::Invalid => String::from("invalid_status"),
    }
  }

  pub fn from_str(status_string: &str) -> OrderStatus {
    match status_string {
      "pending_seller_ship_out" => OrderStatus::PendingSellerShipOut,
      "delivery_in_progress" => OrderStatus::DeliveryInProgress,
      "item_received" => OrderStatus::ItemReceived,
      "order_cancelled_by_system" => OrderStatus::OrderCancelledBySystem,
      "order_cancelled_by_seller" => OrderStatus::OrderCancelledBySeller,
      "order_cancelled_by_buyer" => OrderStatus::OrderCancelledByBuyer,
      _ => OrderStatus::Invalid,
    }
  }
}
