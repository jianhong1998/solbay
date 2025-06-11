use anchor_lang::prelude::error_code;

#[error_code]
pub enum ErrorCode {
  #[msg("Unauthorised Seller")]
  UnauthorisedSeller,

  #[msg("Unauthorised Action")]
  UnauthorisedAction,

  #[msg("Invalid Mint")]
  InvalidMint,

  #[msg("Unauthorized Buyer")]
  UnauthorisedBuyer,

  #[msg("Escrow profit cannot be more than 100")]
  EscrowProfitExceedLimit,

  #[msg("Order fund is already released")]
  OrderFundIsAlreadyReleased,
}
