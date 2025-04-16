use crate::{constants::ANCHOR_DISCRIMINATOR, states::Solbay};
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct InitializeSolbay<'info> {
  pub system_program: Program<'info, System>,

  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = ANCHOR_DISCRIMINATOR + Solbay::INIT_SPACE,
  payer = payer
  )]
  pub solbay: Account<'info, Solbay>,
}
