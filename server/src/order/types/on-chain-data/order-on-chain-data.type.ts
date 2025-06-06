import { Program, ProgramAccount } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
import { UUID } from 'crypto';
import { UuidHelper } from 'src/common/helpers/uuid.helper';
import { Solbay } from 'src/contract/src';
import { OrderOnChainDataHelperUtil } from 'src/on-chain-program/utils/order-on-chain-data-helper.util';
import { OrderStatus } from 'src/order/enums/order-status.enum';

/**
 * Parsed onchain order data
 */
export type IOrderOnchainData = {
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

export type IRawOrderOnchainData = Awaited<
  ReturnType<Program<Solbay>['account']['order']['fetch']>
>;

export type IRawAllOrderOnchainData = ProgramAccount<IRawOrderOnchainData>;

export class OrderOnchainData implements IOrderOnchainData {
  amount: number;
  bump: number;
  buyerPubkey: PublicKey;
  fundReleaseTimeout: number;
  isFundReleased: boolean;
  orderId: `${string}-${string}-${string}-${string}-${string}`;
  platformCode: string;
  remarks: string;
  sellerPubkey: PublicKey;
  sellerShipOutTimeout: number;
  status: OrderStatus;
  tokenMintAddress: PublicKey;

  constructor(rawOnchainOrderData: IRawOrderOnchainData) {
    const {
      amount,
      bump,
      buyerPubkey,
      fundReleaseTimeout,
      isFundReleased,
      orderId,
      platformCode,
      remarks,
      sellerPubkey,
      sellerShipOutTimeout,
      status,
      tokenMintAddress,
    } = rawOnchainOrderData;

    this.isFundReleased = isFundReleased;
    this.sellerPubkey = sellerPubkey;
    this.buyerPubkey = buyerPubkey;
    this.amount = Number(amount);
    this.fundReleaseTimeout = Number(fundReleaseTimeout);
    this.sellerShipOutTimeout = Number(sellerShipOutTimeout);
    this.orderId = UuidHelper.convertBytesToUuid(orderId);
    this.tokenMintAddress = tokenMintAddress;
    this.platformCode = platformCode;
    this.status = OrderOnChainDataHelperUtil.convertOrderStatus(status);
    this.remarks = remarks;
    this.bump = bump;
  }
}
