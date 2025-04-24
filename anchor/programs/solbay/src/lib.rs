#![allow(clippy::result_large_err)]

mod constants;
mod instructions;
mod states;

use anchor_lang::prelude::*;
pub use instructions::*;

declare_id!("DsEJ8Xoffs9GSDhzPV3iUi7LskYSJxUKfhgotnWbUpme");

#[program]
pub mod solbay {

  use super::*;

  pub fn login(context: Context<Login>) -> Result<()> {
    process_login(context)
  }
}
