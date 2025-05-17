use anchor_lang::prelude::*;
use anchor_spl::token_interface::Mint;

use crate::{constants::{ OrderStatus, ANCHOR_DISCRIMINATOR, ORDER_SEED}, states::Order};

/**
 * Sample only
 * TODO: Complete payment feature
*/
#[derive(Accounts)]
#[instruction(order_id: String, platform_code: String)]
pub struct Purchase<'info> {
  pub system_program: Program<'info, System>,

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
}

pub fn process_purchase(context: Context<Purchase>, amount: u64, seller_timeout: u64, platform_code: String, order_id: String, remarks: String ) -> Result<()> {

  let order_entry = &mut context.accounts.order;
  
  order_entry.is_fund_released = false;
  order_entry.fund_release_timeout = 0;
  order_entry.status = OrderStatus::PendingSellerShipOut.to_str();

  order_entry.amount = amount;
  order_entry.platform_code = platform_code;
  order_entry.order_id = order_id;
  order_entry.remarks = remarks;
  order_entry.seller_ship_out_timeout = seller_timeout;
  
  order_entry.seller_pubkey = context.accounts.seller.key();
  order_entry.buyer_pubkey = context.accounts.buyer.key();
  order_entry.token_mint_address = context.accounts.mint.key();



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


  
  
  
  
  
  
  
  //get buyer pubkey and seller's pubkey

  //
  Ok(())
}
