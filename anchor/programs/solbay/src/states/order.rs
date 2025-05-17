use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Order {
  pub is_fund_released: bool,
  pub seller_pubkey: Pubkey,
  pub buyer_pubkey: Pubkey,
  pub amount: u64,
  pub seller_ship_out_timeout: u64,
  pub fund_release_timeout: u64,
  pub token_mint_address: Pubkey,

  #[max_len(4)]
  pub platform_code: String,
  #[max_len(36)]
  pub order_id: String,
  #[max_len(25)]
  pub status: String,
  #[max_len(512)]
  pub remarks: String,
}
