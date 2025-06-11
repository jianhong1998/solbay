use anchor_lang::prelude::*;
use anchor_spl::{
  token::Token,
  token_interface::{Mint, TokenAccount},
};

use crate::{
  constants::{
    ErrorCode, OrderStatus, ANCHOR_DISCRIMINATOR, ESCROW_AUTHORITY_SEED, ESCROW_CONFIG_SEED,
    ESCROW_OPERATION_ACCOUNT_SEED, ESCROW_SEED, ORDER_SEED,
  },
  states::{EscrowConfig, Order},
  util::{process_token_transfer_with_signer, ProcessTokenTransferWithSigner},
};

#[derive(Accounts)]
#[instruction(order_id: [u8; 16], platform_code: String)]
pub struct ReceiveOrder<'info> {
  pub system_program: Program<'info, System>,
  pub token_program: Program<'info, Token>,

  #[account(mut)]
  pub buyer: Signer<'info>,

  #[account(
    address = order.seller_pubkey @ ErrorCode::UnauthorisedSeller
  )]
  pub seller: SystemAccount<'info>,

  #[account(
    mut,
    associated_token::mint = mint,
    associated_token::authority = seller,
  )]
  pub seller_associated_token_account: InterfaceAccount<'info, TokenAccount>,

  #[account(
    mut,
    constraint = order.buyer_pubkey == buyer.key() @ ErrorCode::UnauthorisedBuyer,
    constraint = order.status == OrderStatus::DeliveryInProgress.to_str() @ ErrorCode::UnauthorisedAction,
    realloc = ANCHOR_DISCRIMINATOR + Order::INIT_SPACE,
    realloc::payer = escrow_operation_account,
    realloc::zero = false,
    seeds = [
      ORDER_SEED,
      order_id.as_ref(),
      platform_code.as_bytes()
    ],
    bump = order.bump
  )]
  pub order: Account<'info, Order>,

  #[account(
    address = order.token_mint_address @ ErrorCode::InvalidMint
  )]
  pub mint: InterfaceAccount<'info, Mint>,

  #[account(
    seeds = [
      ESCROW_CONFIG_SEED,
      mint.key().as_ref()
    ],
    bump = escrow_config.bump_escrow_config
  )]
  pub escrow_config: Account<'info, EscrowConfig>,

  #[account(
    seeds = [
      ESCROW_AUTHORITY_SEED,
      mint.key().as_ref()
    ],
    bump = escrow_config.bump_authority
  )]
  pub authority: SystemAccount<'info>,

  #[account(
    mut,
    seeds = [
      ESCROW_SEED,
      mint.key().as_ref()
    ],
    bump = escrow_config.bump_escrow_token_account
  )]
  pub escrow_token_account: InterfaceAccount<'info, TokenAccount>,

  #[account(
    mut,
    seeds = [
      ESCROW_OPERATION_ACCOUNT_SEED,
      mint.key().as_ref()
    ],
    bump = escrow_config.bump_escrow_operation_account
  )]
  pub escrow_operation_account: InterfaceAccount<'info, TokenAccount>,
}

pub fn process_receive_order(context: Context<ReceiveOrder>) -> Result<()> {
  let order = &mut context.accounts.order;
  let escrow_config = &context.accounts.escrow_config;
  let escrow_token_account = &context.accounts.escrow_token_account;
  let seller_token_account = &context.accounts.seller_associated_token_account;
  let escrow_opetaion_token_account = &context.accounts.escrow_operation_account;
  let mint = &context.accounts.mint;

  order.status = OrderStatus::ItemReceived.to_str();

  let signer_seeds: Vec<Vec<u8>> = vec![
    ESCROW_AUTHORITY_SEED.to_vec(),
    mint.key().to_bytes().to_vec(),
    vec![context.accounts.escrow_config.bump_authority],
  ];

  let amount_to_escrow_operation_account: u64 =
    match order.amount.checked_mul(escrow_config.escrow_profit_percentage as u64) {
      Some(result) => result / 100,
      None => 0,
    };
  let amount_to_seller: u64 = match order.amount.checked_sub(amount_to_escrow_operation_account) {
    Some(result) => result,
    None => 0,
  };

  // Transfer to Seller
  msg!("Transfering {} to seller", amount_to_seller);
  process_token_transfer_with_signer(ProcessTokenTransferWithSigner {
    from: escrow_token_account.to_account_info(),
    to: seller_token_account.to_account_info(),
    amount: amount_to_seller,
    mint: mint.to_account_info(),
    decimals: mint.decimals,
    program: context.accounts.token_program.to_account_info(),
    authority: context.accounts.authority.to_account_info(),
    signer_seeds: signer_seeds.clone(),
  })?;

  // Transfer to Escrow
  msg!("Transfering {} to escrow operation account", amount_to_escrow_operation_account);
  process_token_transfer_with_signer(ProcessTokenTransferWithSigner {
    from: escrow_token_account.to_account_info(),
    to: escrow_opetaion_token_account.to_account_info(),
    amount: amount_to_escrow_operation_account,
    mint: mint.to_account_info(),
    decimals: mint.decimals,
    program: context.accounts.token_program.to_account_info(),
    authority: context.accounts.authority.to_account_info(),
    signer_seeds,
  })?;

  Ok(())
}
