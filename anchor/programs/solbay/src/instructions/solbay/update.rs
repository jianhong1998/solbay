use crate::states::Solbay;
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub solbay: Account<'info, Solbay>,
}
