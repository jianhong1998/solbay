import { PublicKey } from '@solana/web3.js';
import { UUID } from 'crypto';
import { OrderStatus } from 'src/order/enums/order-status.enum';

/**
 * Parsed onchain order data
 */
export type IOnChainOrderData = {
  isFundReleased: boolean;
  sellerPubkey: PublicKey;
  buyerPubkey: PublicKey;
  amount: number;
  sellerShipOutTimeout: number;
  fundReleaseTimeout: number;
  tokenMintAddress: PublicKey;
  orderId: UUID;
  platformCode: string;
  status: OrderStatus;
  remarks: string;
  bump: number;
};
