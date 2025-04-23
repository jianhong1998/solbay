use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct Login<'info> {
  pub system_program: Program<'info, System>,

  #[account()]
  pub signer: Signer<'info>,
}

pub fn process_login(_context: Context<Login>) -> Result<()> {
  Ok(())
}
