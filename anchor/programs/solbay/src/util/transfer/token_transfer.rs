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
