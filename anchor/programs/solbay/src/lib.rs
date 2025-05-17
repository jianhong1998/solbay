#![allow(clippy::result_large_err)]

mod constants;
mod instructions;
mod states;
mod util;

use anchor_lang::prelude::*;
pub use instructions::*;

declare_id!("DsEJ8Xoffs9GSDhzPV3iUi7LskYSJxUKfhgotnWbUpme");

#[program]
pub mod solbay {

  use super::*;

  pub fn login(context: Context<Login>) -> Result<()> {
    process_login(context)
  }

  pub fn init_escrow(context: Context<InitEscrow>) -> Result<()> {
    process_init_escrow(context)
  }

  pub fn purchase(
    context: Context<Purchase>,
    order_id: String,
    platform_code: String,
    amount: u64,
    seller_timeout: u64,
    remarks: String,
  ) -> Result<()> {
    process_purchase(context, order_id, platform_code, amount, seller_timeout, remarks)
  }
}
