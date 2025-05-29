import { PublicKey } from '@solana/web3.js';

export type IAirdropUsdcParams = {
  publicKey: PublicKey;
  amount: number;
};

export type IAirdropUsdcResult = {
  publicKey: PublicKey;
  balance: number;
};
