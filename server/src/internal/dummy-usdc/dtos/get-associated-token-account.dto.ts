import { Account, Mint } from '@solana/spl-token';

export class GetAssociatedTokenAccountResDTO {
  publicKey: string;
  amount: number;
  status: {
    isFrozen: boolean;
    isInitialized: boolean;
  };
  mint: string;
  owner: string;

  constructor(account: Account, mint: Mint) {
    const {
      address,
      amount,
      isFrozen,
      isInitialized,
      owner,
      mint: accountMint,
    } = account;

    this.publicKey = address.toBase58();
    this.mint = accountMint.toBase58();
    this.owner = owner.toBase58();

    this.amount = Number(amount) / Math.pow(10, mint.decimals);
    this.status = {
      isFrozen,
      isInitialized,
    };
  }
}
