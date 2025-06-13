use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct EscrowConfig {
  pub escrow_profit_percentage: u8,
  pub withdraw_recipient: Pubkey,
  pub bump_escrow_config: u8,
  pub bump_escrow_token_account: u8,
  pub bump_authority: u8,
  pub bump_escrow_operation_account: u8,
}
