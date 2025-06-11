use anchor_lang::prelude::*;
use anchor_spl::{
  token::Token,
  token_interface::{Mint, TokenAccount},
};

use crate::{
  constants::{
    ErrorCode, ESCROW_AUTHORITY_SEED, ESCROW_CONFIG_SEED, ESCROW_OPERATION_ACCOUNT_SEED,
  },
  states::EscrowConfig,
  util::{process_token_transfer_with_signer, ProcessTokenTransferWithSigner},
};

#[derive(Accounts)]
pub struct WithdrawFromOperationAccount<'info> {
  pub system_program: Program<'info, System>,
  pub token_program: Program<'info, Token>,

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
    seeds = [
      ESCROW_AUTHORITY_SEED,
      mint.key().as_ref()
    ],
    bump = escrow_config.bump_authority
  )]
  pub escrow_authority: SystemAccount<'info>,

  #[account(
    mut,
    seeds = [
      ESCROW_OPERATION_ACCOUNT_SEED,
      mint.key().as_ref()
    ],
    bump = escrow_config.bump_escrow_operation_account
  )]
  pub escrow_operation_token_account: InterfaceAccount<'info, TokenAccount>,

  #[account(
    address = escrow_config.withdraw_recipient @ ErrorCode::UnauthorisedRecipient
  )]
  pub recipient_account: InterfaceAccount<'info, TokenAccount>,
}

pub fn process_withdraw_from_operation_account(
  context: Context<WithdrawFromOperationAccount>,
  amount: u64,
) -> Result<()> {
  let mint = &context.accounts.mint;
  let recipient = &context.accounts.recipient_account;
  let escrow_operation_account = &context.accounts.escrow_operation_token_account;
  let authority = &context.accounts.escrow_authority;

  let signer_seeds: Vec<Vec<u8>> = vec![
    ESCROW_AUTHORITY_SEED.to_vec(),
    mint.key().as_ref().to_vec(),
    vec![context.accounts.escrow_config.bump_escrow_config],
  ];

  process_token_transfer_with_signer(ProcessTokenTransferWithSigner {
    from: escrow_operation_account.to_account_info(),
    to: recipient.to_account_info(),
    amount,
    mint: mint.to_account_info(),
    decimals: mint.decimals,
    authority: authority.to_account_info(),
    program: context.accounts.token_program.to_account_info(),
    signer_seeds,
  })?;

  Ok(())
}
