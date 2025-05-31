import {
  BlockhashWithExpiryBlockHeight,
  VersionedTransaction,
} from '@solana/web3.js';
import { TransactionUtil } from 'src/solana-connection/utils/transaction.util';

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
