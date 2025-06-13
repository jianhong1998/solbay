use anchor_lang::prelude::*;
use anchor_spl::{
  associated_token::AssociatedToken,
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
  pub recipient: SystemAccount<'info>,

  #[account(
    init_if_needed,
    payer = signer,
    associated_token::mint = mint,
    associated_token::authority = recipient,
  )]
  pub recipient_token_account: InterfaceAccount<'info, TokenAccount>,
}

pub fn process_withdraw_from_operation_account(
  context: Context<WithdrawFromOperationAccount>,
  amount: u64,
) -> Result<()> {
  let mint = &context.accounts.mint;
  let recipient_token_account = &context.accounts.recipient_token_account;
  let escrow_operation_account = &context.accounts.escrow_operation_token_account;
  let authority = &context.accounts.escrow_authority;

  /* Check amount */

  if escrow_operation_account.amount < amount {
    return err!(ErrorCode::InsufficientAmount);
  }

  /* Perform transaction */

  let static_key = ESCROW_AUTHORITY_SEED.to_vec();
  let mint_key = mint.to_account_info().key().to_bytes().to_vec();
  let bump = vec![context.accounts.escrow_config.bump_authority.clone()];

  let signer_seeds: Vec<Vec<u8>> = vec![static_key, mint_key, bump];

  msg!("Authority: {}", authority.key());

  process_token_transfer_with_signer(ProcessTokenTransferWithSigner {
    program: context.accounts.token_program.to_account_info(),
    authority: authority.to_account_info(),
    mint: mint.to_account_info(),
    from: escrow_operation_account.to_account_info(),
    to: recipient_token_account.to_account_info(),
    amount,
    decimals: mint.decimals,
    signer_seeds,
  })?;

  Ok(())
}
