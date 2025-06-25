use anchor_lang::prelude::*;
use anchor_spl::token_interface::{Mint, TokenAccount};

use crate::{
  constants::{
    ErrorCode, OrderStatus, ANCHOR_DISCRIMINATOR, ESCROW_CONFIG_SEED,
    ESCROW_OPERATION_ACCOUNT_SEED, ORDER_SEED,
  },
  states::{EscrowConfig, Order},
  util::{add_days, get_start_of_date},
};

//context shape
#[derive(Accounts)]
#[instruction(order_id: [u8; 16], platform_code: String)]
pub struct DeliveryInProgress<'info> {
  pub system_program: Program<'info, System>,

  #[account(mut)]
  pub seller: Signer<'info>,

  #[account(
    mut,
    constraint = order.seller_pubkey == seller.key() @ ErrorCode::UnauthorisedSeller,
    constraint = order.status == OrderStatus::PendingSellerShipOut.to_str() @ ErrorCode::UnauthorisedAction,
    realloc = ANCHOR_DISCRIMINATOR + Order::INIT_SPACE,
    realloc::payer = escrow_operation_account,
    realloc::zero = false,
    seeds = [ORDER_SEED, order_id.as_ref(), platform_code.as_bytes()],
    bump = order.bump,
  )]
  pub order: Account<'info, Order>,

  #[account(
    address = order.token_mint_address @ ErrorCode::InvalidMint,
  )]
  pub mint: InterfaceAccount<'info, Mint>,

  #[account(
    mut,
    seeds = [
      ESCROW_OPERATION_ACCOUNT_SEED,
      mint.key().as_ref()
    ],
    bump = escrow_config.bump_escrow_operation_account
  )]
  pub escrow_operation_account: InterfaceAccount<'info, TokenAccount>,

  #[account(
    seeds = [
      ESCROW_CONFIG_SEED,
      mint.key().as_ref()
    ],
    bump = escrow_config.bump_escrow_config
  )]
  pub escrow_config: Account<'info, EscrowConfig>,
}

//service method
pub fn process_delivery_in_progress(
  context: Context<DeliveryInProgress>,
  estimated_deliver_date: u64,
) -> Result<()> {
  /* Check if order is timeout */
  let now = Clock::get()?.unix_timestamp as u64;

  if context.accounts.order.seller_ship_out_timeout < now {
    return Err(ErrorCode::ExceedSellerShipOutTimeout.into());
  }

  let start_of_estimated_deliver_date = get_start_of_date(estimated_deliver_date);
  msg!("Estimated Delivery Date: {}", estimated_deliver_date);
  msg!("Start of Estimated Delivery Date: {}", start_of_estimated_deliver_date);

  let current_time = Clock::get()?.unix_timestamp;
  if current_time >= start_of_estimated_deliver_date as i64 {
    return Err(ErrorCode::InvalidFundReleaseTimeout.into());
  }

  let fund_release_timeout = add_days(start_of_estimated_deliver_date, 2);
  msg!("Fund Release Timeout: {}", fund_release_timeout);

  context.accounts.order.status = OrderStatus::DeliveryInProgress.to_str();
  context.accounts.order.fund_release_timeout = fund_release_timeout;
  Ok(())
}
