use anchor_lang::prelude::*;
use anchor_spl::{
  associated_token::AssociatedToken,
  token::Token,
  token_interface::{Mint, TokenAccount},
};

use crate::{
  constants::{ESCROW_AUTHORITY_SEED, ESCROW_CONFIG_SEED, ESCROW_SEED},
  states::EscrowConfig,
  util::{process_token_transfer_with_signer, ProcessTokenTransferWithSigner},
};

#[derive(Accounts)]
pub struct SampleWithdraw<'info> {
  pub system_program: Program<'info, System>,
  pub token_program: Program<'info, Token>,
  pub associated_token_program: Program<'info, AssociatedToken>,

  #[account(mut)]
  pub signer: Signer<'info>,

  #[account()]
  pub mint: InterfaceAccount<'info, Mint>,

  #[account(
    seeds = [
      ESCROW_CONFIG_SEED,
      mint.key().as_ref()
    ],
    bump = escrow_config.bump_escrow_config
  )]
  pub escrow_config: Box<Account<'info, EscrowConfig>>,

  #[account(
    mut,
    seeds = [
      ESCROW_SEED,
      mint.key().as_ref()
    ],
    bump = escrow_config.bump_escrow_token_account
  )]
  pub escrow_token_account: InterfaceAccount<'info, TokenAccount>,

  #[account(
    seeds = [
      ESCROW_AUTHORITY_SEED,
      mint.key().as_ref()
    ],
    bump = escrow_config.bump_authority
  )]
  pub escrow_authority: SystemAccount<'info>,

  #[account(
    init_if_needed,
    payer = signer,
    associated_token::mint = mint,
    associated_token::authority = signer
  )]
  recipient_token_account: InterfaceAccount<'info, TokenAccount>,
}

pub fn proceed_sample_withdraw<'a>(context: Context<SampleWithdraw>, amount: u64) -> Result<()> {
  let static_key = ESCROW_AUTHORITY_SEED.to_vec();
  let mint_key = context.accounts.mint.to_account_info().key().to_bytes().to_vec();
  let bump = vec![context.accounts.escrow_config.bump_authority.clone()];

  let seeds: Vec<Vec<u8>> = vec![static_key, mint_key, bump];

  process_token_transfer_with_signer(ProcessTokenTransferWithSigner {
    program: context.accounts.token_program.to_account_info(),
    authority: context.accounts.escrow_authority.to_account_info(),
    mint: context.accounts.mint.to_account_info(),
    from: context.accounts.escrow_token_account.to_account_info(),
    to: context.accounts.recipient_token_account.to_account_info(),
    amount,
    decimals: context.accounts.mint.decimals,
    signer_seeds: seeds,
  })
}
