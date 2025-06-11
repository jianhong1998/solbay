import {
  BlockhashWithExpiryBlockHeight,
  VersionedTransaction,
} from '@solana/web3.js';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { TransactionUtil } from 'src/solana-connection/utils/transaction.util';

export class TransactionDataDTO {
  @IsString()
  @IsOptional()
  transaction: string;

  @IsString()
  @IsOptional()
  latestBlockhash: string;

  @IsNumber()
  @IsOptional()
  lastValidBlockHeight: number;

  constructor(transactionData: {
    transaction: VersionedTransaction;
    latestBlockhash: BlockhashWithExpiryBlockHeight;
  }) {
    const { latestBlockhash, transaction } = transactionData;

    this.transaction = TransactionUtil.serializeTransaction(transaction);
    this.latestBlockhash = latestBlockhash.blockhash;
    this.lastValidBlockHeight = latestBlockhash.lastValidBlockHeight;
  }
}
