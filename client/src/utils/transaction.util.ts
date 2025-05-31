import {
  BlockhashWithExpiryBlockHeight,
  Commitment,
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from '@solana/web3.js';

export class TransactionUtil {
  private constructor() {}

  public static async createTransaction(params: {
    instructions: TransactionInstruction[];
    payerPublicKey: PublicKey;
    connection: Connection;
  }) {
    const { connection, instructions, payerPublicKey } = params;

    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();

    const transactionMessage = new TransactionMessage({
      instructions,
      payerKey: payerPublicKey,
      recentBlockhash: blockhash,
    }).compileToV0Message();

    const transaction = new VersionedTransaction(transactionMessage);

    return {
      transaction,
      latestBlockhash: {
        blockhash,
        lastValidBlockHeight,
      },
    };
  }

  public static async sendAndConfirmTransaction(params: {
    transaction: VersionedTransaction | Transaction;
    connection: Connection;
    latestBlockhash: BlockhashWithExpiryBlockHeight;
    commitment?: Commitment;
    skipPreflight?: boolean;
  }): Promise<string> {
    const {
      connection,
      latestBlockhash: { blockhash, lastValidBlockHeight },
      transaction,
      commitment = 'confirmed',
      skipPreflight = false,
    } = params;

    const transactionId = await connection.sendRawTransaction(
      transaction.serialize(),
      {
        skipPreflight,
      },
    );

    await connection.confirmTransaction(
      {
        blockhash,
        lastValidBlockHeight,
        signature: transactionId,
      },
      commitment,
    );

    return transactionId;
  }

  public static serializeTransaction(
    transaction: VersionedTransaction,
  ): string {
    return Buffer.from(transaction.serialize()).toString('base64');
  }

  public static deserializeTransaction(
    serializedTransaction: string,
  ): VersionedTransaction {
    return VersionedTransaction.deserialize(
      Buffer.from(serializedTransaction, 'base64'),
    );
  }
}
