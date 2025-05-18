import {
  createMint,
  getMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
} from '@solana/spl-token';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';

import { ProgramAccountHelper } from './account.util';
import { AirdropHelper } from './airdrop.helper';

export class MockUsdcUtil {
  private static readonly authorityKeypair =
    ProgramAccountHelper.getAccountKeypair('usdcAuthority');
  private static readonly mintKeypair =
    ProgramAccountHelper.getAccountKeypair('usdcMint');
  private static readonly payerKeypair =
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
      );
    }

    return { authority, mint };
  }

  public static async mintMockUsdc(params: {
    connection: Connection;
    recipientPublicKey: PublicKey;
    amount: number;
  }): Promise<void> {
    const { connection, recipientPublicKey, amount } = params;

    const authority = this.authorityKeypair;
    const mintKeypair = this.mintKeypair;

    const associatedTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      this.payerKeypair,
      mintKeypair.publicKey,
      recipientPublicKey,
    );

    await mintTo(
      connection,
      authority,
      mintKeypair.publicKey,
      associatedTokenAccount.address,
      authority,
      amount * 1_000_000,
    );
  }
}
