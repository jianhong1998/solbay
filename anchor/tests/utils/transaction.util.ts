import {
  Blockhash,
  Connection,
  PublicKey,
  Signer,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from '@solana/web3.js';

export class TransactionHelper {
  private constructor() {}

  public static generateTransaction(params: {
    instructions: TransactionInstruction[];
    payer: PublicKey;
    recentBlockhash: string;
    signers: Signer[];
  }): VersionedTransaction {
    const { instructions, payer, recentBlockhash, signers } = params;

    const transactionMessage = new TransactionMessage({
      instructions,
      payerKey: payer,
      recentBlockhash,
    }).compileToV0Message();

    const transaction = new VersionedTransaction(transactionMessage);
    transaction.sign(signers);

    return transaction;
  }

  public static async sendAndConfirmTransaction(params: {
    connection: Connection;
    transaction: VersionedTransaction;
    blockhashObj: {
      blockhash: Blockhash;
      lastValidBlockHeight: number;
    };
    skipPreflight?: boolean;
  }): Promise<string> {
    const {
      blockhashObj: { blockhash, lastValidBlockHeight },
      connection,
      transaction,
      skipPreflight = false,
    } = params;

    const transactionId = await connection.sendTransaction(transaction, {
      skipPreflight,
    });
    await connection.confirmTransaction({
      blockhash,
      lastValidBlockHeight,
      signature: transactionId,
    });

    return transactionId;
  }
}
