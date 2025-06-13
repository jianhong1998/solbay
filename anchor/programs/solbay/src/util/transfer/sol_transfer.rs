use anchor_lang::{
  prelude::*,
  system_program::{transfer, Transfer},
};

#[allow(dead_code)]
pub struct SolTransfer<'info> {
  pub from: AccountInfo<'info>,
  pub to: AccountInfo<'info>,
  pub lamport_amount: u64,
  pub system_program: AccountInfo<'info>,
}

#[allow(dead_code)]
pub struct SolTransferWithSigner<'info> {
  pub from: AccountInfo<'info>,
  pub to: AccountInfo<'info>,
  pub lamport_amount: u64,
  pub system_program: AccountInfo<'info>,
  pub signer_seeds: Vec<Vec<u8>>,
}

#[allow(dead_code)]
pub fn process_sol_transfer(params: SolTransfer) -> Result<()> {
  let sender = params.from.to_account_info();
  let recipient = params.to.to_account_info();

  let cpi_accounts = Transfer { from: sender, to: recipient };
  let cpi_context = CpiContext::new(params.system_program, cpi_accounts);

  transfer(cpi_context, params.lamport_amount)
}

#[allow(dead_code)]
pub fn process_sol_transfer_with_signer(params: SolTransferWithSigner) -> Result<()> {
  let seeds_slices = params.signer_seeds.iter().map(|seed| seed.as_slice()).collect::<Vec<&[u8]>>();
  let seeds = &[&seeds_slices[..]];

  let sender = params.from.to_account_info();
  let recipient = params.to.to_account_info();

  let cpi_accounts = Transfer { from: sender, to: recipient };
  let cpi_context = CpiContext::new_with_signer(params.system_program, cpi_accounts, seeds);

  transfer(cpi_context, params.lamport_amount)
}
