use anchor_lang::prelude::error_code;

#[error_code]
pub enum ErrorCode {
  #[msg("Unauthorised Seller")]
  UnauthorisedSeller,

  #[msg("Unauthorised Action")]
  UnauthorisedAction,

  #[msg("Unauthorised Buyer")]
  UnauthorisedBuyer,

  #[msg("Unauthorised Recipient")]
  UnauthorisedRecipient,

  #[msg("Invalid Mint")]
  InvalidMint,

  #[msg("Escrow profit cannot be more than 100")]
  EscrowProfitExceedLimit,

  #[msg("Order fund is already released")]
  OrderFundIsAlreadyReleased,
}
