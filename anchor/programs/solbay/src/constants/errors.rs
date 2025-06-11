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
}
