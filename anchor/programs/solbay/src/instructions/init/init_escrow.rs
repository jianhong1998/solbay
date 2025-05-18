use anchor_lang::prelude::*;
use anchor_spl::{
  token::Token,
  token_interface::{Mint, TokenAccount},
};

use crate::constants::ESCROW_SEED;

#[derive(Accounts)]
pub struct InitEscrow<'info> {
  pub system_program: Program<'info, System>,
  pub token_program: Program<'info, Token>,

  #[account(mut)]
  pub signer: Signer<'info>,

  #[account()]
  pub mint: InterfaceAccount<'info, Mint>,

  #[account(
    init,
    payer = signer,
    token::mint = mint,
    token::authority = signer,
    seeds = [
      ESCROW_SEED,
      mint.key().as_ref()
    ],
    bump
  )]
  pub escrow_token_account: InterfaceAccount<'info, TokenAccount>,
}

pub fn process_init_escrow(_context: Context<InitEscrow>) -> Result<()> {
  Ok(())
}
