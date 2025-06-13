use anchor_lang::prelude::*;
use anchor_spl::{
  token::Token,
  token_interface::{Mint, TokenAccount},
};

use crate::{
  constants::{
    ErrorCode, ANCHOR_DISCRIMINATOR, ESCROW_AUTHORITY_SEED, ESCROW_CONFIG_SEED,
    ESCROW_OPERATION_ACCOUNT_SEED, ESCROW_SEED,
  },
  states::EscrowConfig,
};

#[derive(Accounts)]
pub struct InitEscrow<'info> {
  pub system_program: Program<'info, System>,
  pub token_program: Program<'info, Token>,

  #[account(mut)]
  pub signer: Signer<'info>,

  #[account()]
  pub mint: InterfaceAccount<'info, Mint>,

  #[account(
    mut,
    seeds = [
      ESCROW_AUTHORITY_SEED,
      mint.key().as_ref()
    ],
    bump
  )]
  pub authority: SystemAccount<'info>,

  #[account(
    init,
    payer = signer,
    token::mint = mint,
    token::authority = authority,
    seeds = [
      ESCROW_SEED,
      mint.key().as_ref()
    ],
    bump
  )]
  pub escrow_token_account: InterfaceAccount<'info, TokenAccount>,

  #[account(
    init,
    payer = signer,
    token::mint = mint,
    token::authority = authority,
    seeds = [
      ESCROW_OPERATION_ACCOUNT_SEED,
      mint.key().as_ref()
    ],
    bump
  )]
  pub operation_token_account: InterfaceAccount<'info, TokenAccount>,

  #[account(
    init,
    payer = signer,
    space = ANCHOR_DISCRIMINATOR + EscrowConfig::INIT_SPACE,
    seeds = [
      ESCROW_CONFIG_SEED,
      mint.key().as_ref()
    ],
    bump
  )]
  pub escrow_config: Box<Account<'info, EscrowConfig>>,
}

pub fn process_init_escrow(
  context: Context<InitEscrow>,
  escrow_profit_percentage: u8,
) -> Result<()> {
  let escrow_config = &mut context.accounts.escrow_config;

  if escrow_profit_percentage > 100 {
    return Err(ErrorCode::EscrowProfitExceedLimit.into());
  }

  escrow_config.escrow_profit_percentage = escrow_profit_percentage;
  escrow_config.withdraw_recipient = context.accounts.signer.key();
  escrow_config.bump_escrow_config = context.bumps.escrow_config;
  escrow_config.bump_authority = context.bumps.authority;
  escrow_config.bump_escrow_token_account = context.bumps.escrow_token_account;
  escrow_config.bump_escrow_operation_account = context.bumps.operation_token_account;

  Ok(())
}
