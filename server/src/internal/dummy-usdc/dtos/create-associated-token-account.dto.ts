import {
  BlockhashWithExpiryBlockHeight,
  VersionedTransaction,
} from '@solana/web3.js';
import { IsString, Length } from 'class-validator';
import { TransactionUtil } from 'src/solana-connection/utils/transaction.util';

export class CreateAssociatedTokenAccountReqDTO {
  @IsString()
  @Length(44, 44)
  owner: string;
}

export class CreateAssociatedTokenAccountResDTO {
  transaction: string;
  latestBlockhash: BlockhashWithExpiryBlockHeight;

  constructor(
    transaction: VersionedTransaction,
    latestBlockhash: BlockhashWithExpiryBlockHeight,
  ) {
    this.latestBlockhash = latestBlockhash;
    this.transaction = TransactionUtil.serializeTransaction(transaction);
  }
}
