use anchor_lang::prelude::*;
use anchor_spl::token_interface::{transfer_checked, Mint, TransferChecked};

pub struct ProcessTokenTransfer<'info> {
  pub program: AccountInfo<'info>,
  pub authority: AccountInfo<'info>,
  pub from: AccountInfo<'info>,
  pub to: AccountInfo<'info>,
  pub mint: InterfaceAccount<'info, Mint>,
  pub amount: u64,
}

pub struct ProcessTokenTransferWithSigner<'info> {
  pub program: AccountInfo<'info>,
  pub authority: AccountInfo<'info>,
  pub from: AccountInfo<'info>,
  pub to: AccountInfo<'info>,
  pub mint: AccountInfo<'info>,
  pub amount: u64,
  pub decimals: u8,
  pub signer_seeds: Vec<Vec<u8>>,
}

pub fn process_token_transfer<'info>(params: ProcessTokenTransfer) -> Result<()> {
  let cpi_accounts = TransferChecked {
    authority: params.authority,
    mint: params.mint.to_account_info(),
    from: params.from,
    to: params.to,
  };
  let cpi_context = CpiContext::new(params.program, cpi_accounts);

  transfer_checked(cpi_context, params.amount, params.mint.decimals)
}

pub fn process_token_transfer_with_signer<'info>(
  params: ProcessTokenTransferWithSigner,
) -> Result<()> {
  let seeds_slices = params.signer_seeds.iter().map(|seed| seed.as_slice()).collect::<Vec<&[u8]>>();
  let seeds: &[&[&[u8]]] = &[&seeds_slices[..]];

  let cpi_accounts = TransferChecked {
    authority: params.authority,
    mint: params.mint.to_account_info(),
    from: params.from,
    to: params.to,
  };
  let cpi_context = CpiContext::new_with_signer(params.program, cpi_accounts, seeds);

  transfer_checked(cpi_context, params.amount, params.decimals)
}
