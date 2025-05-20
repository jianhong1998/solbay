import {
  Account,
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
  private static readonly feePayerKeypair =
    ProgramAccountHelper.getAccountKeypair('feePayer');

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
    recipient: PublicKey;
    amount: number;
    mint?: PublicKey;
    mintAuthority?: Keypair;
    accountType?: 'associated-token-account' | 'token-account';
  }): Promise<void> {
    const {
      connection,
      recipient,
      amount,
      mint,
      mintAuthority,
      accountType = 'associated-token-account',
    } = params;

    if (mint && !mintAuthority) {
      throw new Error('mintAuthority is required when mint is provided.');
    }

    const authority = mintAuthority ?? this.authorityKeypair;
    const mintPublicKey = mint ?? this.mintKeypair.publicKey;

    let recipientTokenAccount: Account | undefined;

    if (accountType === 'associated-token-account') {
      await getOrCreateAssociatedTokenAccount(
        connection,
        this.feePayerKeypair,
        mintPublicKey,
        recipient,
        true,
        'confirmed',
        {
          commitment: 'confirmed',
          maxRetries: 2,
        },
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID,
      );
    }

    await mintTo(
      connection,
      this.feePayerKeypair,
      mintPublicKey,
      recipientTokenAccount?.address ?? recipient,
      authority,
      amount * 1_000_000,
      undefined, // multiSigners
      { commitment: 'confirmed' },
      TOKEN_PROGRAM_ID,
    );
  }
}
