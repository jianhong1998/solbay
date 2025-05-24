use anchor_lang::prelude::*;

use crate::{
    constants::{ErrorCode, OrderStatus, ANCHOR_DISCRIMINATOR, ORDER_SEED},
    states::Order,
};

//context shape
#[derive(Accounts)]
#[instruction(order_id: [u8; 16], platform_code: String)]
pub struct DeliveryInProgress<'info> {
    pub system_program: Program<'info, System>,

    #[account(mut)]
    pub seller: Signer<'info>,

    #[account(
      mut,
      constraint = order.seller_pubkey == seller.key() @ ErrorCode::UnauthorisedSeller,
      constraint = order.status == OrderStatus::PendingSellerShipOut.to_str() @ ErrorCode::UnauthorisedAction,
      realloc = ANCHOR_DISCRIMINATOR + Order::INIT_SPACE,
      //Todo: add solbay_operation_account on init to replace seller as payer
      realloc::payer = seller,  
      realloc::zero = false,
      seeds = [ORDER_SEED, order_id.as_ref(), platform_code.as_bytes()],
      bump,
    )]
    pub order: Account<'info, Order>,
}

//service method
pub fn process_delivery_in_progress(context: Context<DeliveryInProgress>) -> Result<()> {
    context.accounts.order.status = OrderStatus::DeliveryInProgress.to_str();
    Ok(())
}
