use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct EscrowConfig {
  pub bump_escrow_config: u8,
  pub bump_escrow_token_account: u8,
  pub bump_authority: u8,
}
