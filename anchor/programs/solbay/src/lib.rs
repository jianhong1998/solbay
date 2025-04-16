#![allow(clippy::result_large_err)]

mod constants;
mod instructions;
mod states;

use anchor_lang::prelude::*;
pub use instructions::*;
pub use states::*;

declare_id!("EmDFTTKK7pefKKqzFQpzuPmbK4oxkMX7YNYyrJx22EZo");

#[program]
pub mod solbay {

  use super::*;

  pub fn close(_ctx: Context<CloseSolbay>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.solbay.count = ctx.accounts.solbay.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.solbay.count = ctx.accounts.solbay.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeSolbay>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.solbay.count = value.clone();
    Ok(())
  }
}
