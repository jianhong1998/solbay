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

  pub fn init_escrow(context: Context<InitEscrow>, escrow_profit_percentage: u8) -> Result<()> {
    process_init_escrow(context, escrow_profit_percentage)
  }

  pub fn purchase(
    context: Context<Purchase>,
    order_id: [u8; 16],
    platform_code: String,
    amount: u64,
    seller_timeout: u64,
    remarks: String,
  ) -> Result<()> {
    process_purchase(context, order_id, platform_code, amount, seller_timeout, remarks)
  }

  pub fn sample_withdraw(context: Context<SampleWithdraw>, amount: u64) -> Result<()> {
    proceed_sample_withdraw(context, amount)
  }

  pub fn delivery_in_progress(
    context: Context<DeliveryInProgress>,
    _order_id: [u8; 16],
    _platform_code: String,
  ) -> Result<()> {
    process_delivery_in_progress(context)
  }

  pub fn receive_order(
    context: Context<ReceiveOrder>,
    _order_id: [u8; 16],
    _platform_code: String,
  ) -> Result<()> {
    process_receive_order(context)
  }

  pub fn withdraw_from_operation_account(
    context: Context<WithdrawFromOperationAccount>,
    amount: u64,
  ) -> Result<()> {
    process_withdraw_from_operation_account(context, amount)
  }
}
