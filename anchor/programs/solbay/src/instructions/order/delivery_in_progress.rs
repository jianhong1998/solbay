use anchor_lang::prelude::*;
use anchor_spl::token_interface::Mint;

use crate::{
  constants::{
    ErrorCode, OrderStatus, ANCHOR_DISCRIMINATOR, ESCROW_CONFIG_SEED,
    ESCROW_OPERATION_ACCOUNT_SEED, ORDER_SEED,
  },
  states::{EscrowConfig, Order},
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
  pub escrow_operation_account: SystemAccount<'info>,

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
pub fn process_delivery_in_progress(context: Context<DeliveryInProgress>) -> Result<()> {
  context.accounts.order.status = OrderStatus::DeliveryInProgress.to_str();
  Ok(())
}
