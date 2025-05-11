use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Order {
  #[max_len(44)] // UUID length is 44
  pub order_id: String,
}
