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

import { ConnectionUtil } from './connection.util';

export class TransactionUtil {
  public readonly connection: Connection;

  private static self: TransactionUtil;

  private constructor() {
    this.connection = ConnectionUtil.getConnection();
  }

  public static async createTransaction(params: {
    instructions: TransactionInstruction[];
    payerPublicKey: PublicKey;
  }) {
    const { instructions, payerPublicKey } = params;
    const { connection } = this.getSelf();

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
  }): Promise<string> {
    const {
      connection,
      latestBlockhash: { blockhash, lastValidBlockHeight },
      transaction,
      commitment = 'confirmed',
    } = params;

    const transactionId = await connection.sendRawTransaction(
      transaction.serialize(),
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

  private static getSelf(): TransactionUtil {
    if (!this.self) this.self = new TransactionUtil();
    return this.self;
  }
}
