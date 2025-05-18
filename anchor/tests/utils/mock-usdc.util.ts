import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createMint,
  getMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';

import { ProgramAccountHelper } from './account.util';
import { AirdropHelper } from './airdrop.helper';

export class MockUsdcUtil {
  private static readonly authorityKeypair =
    ProgramAccountHelper.getAccountKeypair('usdcAuthority');
  private static readonly mintKeypair =
    ProgramAccountHelper.getAccountKeypair('usdcMint');

  private constructor() {}

  public static async getMockUsdc(
    connection: Connection,
    random: boolean = false,
  ) {
    const authority = random ? Keypair.generate() : this.authorityKeypair;
    const mintKeypair = random ? Keypair.generate() : this.mintKeypair;

    await AirdropHelper.requestAirdrop({
      connection,
      publicKey: authority.publicKey,
      amount: 5,
    });

    let mint: PublicKey;

    try {
      mint = (await getMint(connection, mintKeypair.publicKey)).address;
    } catch (_) {
      mint = await createMint(
        connection,
        authority,
        authority.publicKey,
        authority.publicKey,
        6,
        mintKeypair,
        {
          commitment: 'confirmed',
        },
      );
    }

    return { authority, mint };
  }

  public static async mintMockUsdc(params: {
    connection: Connection;
    recipient: Keypair;
    amount: number;
    mint?: PublicKey;
    mintAuthority?: Keypair;
  }): Promise<void> {
    const { connection, recipient, amount, mint, mintAuthority } = params;

    if (mint && !mintAuthority) {
      throw new Error('mintAuthority is required when mint is provided.');
    }

    const authority = mintAuthority ?? this.authorityKeypair;
    const mintPublicKey = mint ?? this.mintKeypair.publicKey;

    const associatedTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      recipient,
      mintPublicKey,
      recipient.publicKey,
      false,
      'confirmed',
      {
        commitment: 'confirmed',
        maxRetries: 2,
      },
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID,
    );

    await mintTo(
      connection,
      recipient,
      mintPublicKey,
      associatedTokenAccount.address,
      authority,
      amount * 1_000_000,
      undefined,
      { commitment: 'confirmed' },
      TOKEN_PROGRAM_ID,
    );
  }
}
