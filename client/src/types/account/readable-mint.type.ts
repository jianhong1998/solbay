import { Mint } from '@solana/spl-token';

export class ReadableMint {
  readonly publicKey: string;
  readonly decimals: number;
  readonly supply: number;
  readonly isInitialized: boolean;
  readonly mintAuthority: string | null;
  readonly freezeAuthority: string | null;

  constructor(mint: Mint) {
    const {
      address,
      decimals,
      freezeAuthority,
      isInitialized,
      mintAuthority,
      supply,
    } = mint;

    this.publicKey = address.toBase58();
    this.decimals = decimals;
    this.isInitialized = isInitialized;
    this.mintAuthority = mintAuthority?.toBase58() ?? null;
    this.freezeAuthority = freezeAuthority?.toBase58() ?? null;
    this.supply = Number(supply);
  }
}
