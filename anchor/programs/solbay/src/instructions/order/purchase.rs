use anchor_lang::prelude::*;
use anchor_spl::token_interface::{Mint, Token2022, TokenAccount};

use crate::{
  constants::{OrderStatus, ANCHOR_DISCRIMINATOR, ESCROW_SEED, ORDER_SEED},
  states::Order,
  util::process_token_transfer,
};

#[derive(Accounts)]
#[instruction(order_id: String, platform_code: String)]
pub struct Purchase<'info> {
  pub system_program: Program<'info, System>,
  pub token_program: Program<'info, Token2022>,

  #[account(mut)]
  pub buyer: Signer<'info>,

  #[account()]
  pub seller: SystemAccount<'info>,

  #[account()]
  pub mint: InterfaceAccount<'info, Mint>,

  #[account(
    init,
    payer = buyer,
    space = ANCHOR_DISCRIMINATOR + Order::INIT_SPACE,
    seeds = [ORDER_SEED , order_id.as_bytes(), platform_code.as_bytes()],
    bump
  )]
  pub order: Account<'info, Order>,

  #[account(
    mut,
    seeds = [
      ESCROW_SEED,
      mint.key().as_ref()
    ],
    bump
  )]
  escrow_token_account: InterfaceAccount<'info, TokenAccount>,
}

pub fn process_purchase(
  context: Context<Purchase>,
  order_id: String,
  platform_code: String,
  amount: u64,
  seller_timeout: u64,
  remarks: String,
) -> Result<()> {
  /*
    1. Create order struct (data account)
      - get buyer pubkey and seller's pubkey ✅
      - get micro usd amount from client ✅
      - seller ship out timeout, set by backend ✅
      - fund release, only set after seller ship out (+ 14 days) ✅
      - get the usdc mint address (hardcode?) ✅
      - platform code - get from client ✅
      - order id from client ✅
      - status from program decide (default: straight to pending selling ship out)
      - remarks from client ✅

    2. make transaction to Escrow account
  */

  let order_entry = &mut context.accounts.order;
  let token_program = &context.accounts.token_program;
  let mint = &context.accounts.mint;
  let buyer = &context.accounts.buyer;
  let seller = &context.accounts.seller;
  let escrow_token_account = &context.accounts.escrow_token_account;

  order_entry.is_fund_released = false;
  order_entry.fund_release_timeout = 0;
  order_entry.status = OrderStatus::PendingSellerShipOut.to_str();

  order_entry.amount = amount;
  order_entry.platform_code = platform_code;
  order_entry.order_id = order_id;
  order_entry.remarks = remarks;
  order_entry.seller_ship_out_timeout = seller_timeout;

  order_entry.seller_pubkey = *seller.key;
  order_entry.buyer_pubkey = buyer.key();
  order_entry.token_mint_address = mint.key();

  process_token_transfer(
    token_program.to_account_info(),
    context.accounts.buyer.to_account_info(),
    escrow_token_account.to_account_info(),
    mint,
    amount,
  )
}
