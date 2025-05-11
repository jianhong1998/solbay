use anchor_lang::prelude::*;

use crate::states::Order;

/**
 * Sample only
 * TODO: Complete payment feature
*/
#[derive(Accounts)]
pub struct Checkout<'info> {
  pub system_program: Program<'info, System>,

  #[account(mut)]
  pub buyer: Signer<'info>,

  #[account()]
  pub order: Account<'info, Order>,
}

pub fn process_checkout(_context: Context<Checkout>) -> Result<()> {
  Ok(())
}
