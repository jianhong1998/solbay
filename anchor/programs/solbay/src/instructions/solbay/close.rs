use anchor_lang::prelude::*;

use crate::states::Solbay;

#[derive(Accounts)]
pub struct CloseSolbay<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub solbay: Account<'info, Solbay>,
}
