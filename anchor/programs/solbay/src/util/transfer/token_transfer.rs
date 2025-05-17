use anchor_lang::prelude::*;
use anchor_spl::token_interface::{transfer_checked, Mint, TransferChecked};

pub fn process_token_transfer<'info>(
  program: AccountInfo<'info>,
  from: AccountInfo<'info>,
  to: AccountInfo<'info>,
  mint: &InterfaceAccount<'info, Mint>,
  amount: u64,
) -> Result<()> {
  let cpi_accounts = TransferChecked {
    authority: from.clone(),
    mint: mint.to_account_info(),
    from: from.clone(),
    to: to.clone(),
  };
  let cpi_context = CpiContext::new(program, cpi_accounts);

  transfer_checked(cpi_context, amount, mint.decimals)
}
