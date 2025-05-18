import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';

export class AirdropHelper {
  private constructor() {}

  /**
   * Request Airdrop
   * @param amount Amount of SOL.
   */
  public static async requestAirdrop(params: {
    connection: Connection;
    publicKey: PublicKey;
    amount: number;
  }): Promise<string> {
    const { amount, connection, publicKey } = params;

    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();

    const transactionId = await connection.requestAirdrop(
      publicKey,
      amount * LAMPORTS_PER_SOL,
    );

    await connection.confirmTransaction({
      blockhash,
      lastValidBlockHeight,
      signature: transactionId,
    });

    return transactionId;
  }
}
