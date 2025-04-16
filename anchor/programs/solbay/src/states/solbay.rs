use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Solbay {
  pub count: u8,
}
