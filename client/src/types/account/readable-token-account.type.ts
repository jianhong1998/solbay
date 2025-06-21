import { Account, Mint } from '@solana/spl-token';

import { ReadableMint } from './readable-mint.type';

export class ReadableTokenAccount {
  readonly publicKey: string;
  readonly amount: number;
  readonly accountStatus: Readonly<{
    isFrozen: boolean;
    isInitialized: boolean;
  }>;
  readonly owner: string;
  readonly closeAuthority: string | null;
  readonly mint:
    | { hasMintInfo: true; mint: ReadableMint }
    | { hasMintInfo: false; mint: { publicKey: string } };

  constructor(tokenAccount: Account, mint?: Mint) {
    const {
      address,
      amount,
      isFrozen,
      isInitialized,
      mint: tokenAccountMintPublicKey,
      owner,
      closeAuthority,
    } = tokenAccount;

    this.publicKey = address.toBase58();
    this.accountStatus = Object.freeze({
      isFrozen,
      isInitialized,
    });
    this.owner = owner.toBase58();
    this.closeAuthority = closeAuthority?.toBase58() ?? null;

    if (mint && !mint.address.equals(tokenAccountMintPublicKey))
      throw new Error('Unmatched mint address ');

    if (mint) {
      this.amount = Number(amount) / Math.pow(10, mint.decimals);
      this.mint = {
        hasMintInfo: true,
        mint: new ReadableMint(mint),
      };
    } else {
      this.amount = Number(amount);
      this.mint = {
        hasMintInfo: false,
        mint: {
          publicKey: tokenAccountMintPublicKey.toBase58(),
        },
      };
    }
  }
}
