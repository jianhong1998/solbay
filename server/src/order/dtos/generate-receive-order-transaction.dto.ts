import {
  BlockhashWithExpiryBlockHeight,
  VersionedTransaction,
} from '@solana/web3.js';
import { Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';

import { TransactionDataDTO } from './transaction-data.dto';

export class GenerateReceiveOrderTransactionResDTO {
  @IsObject()
  @ValidateNested()
  @Type(() => TransactionDataDTO)
  transactionData: TransactionDataDTO;

  constructor(
    transaction: VersionedTransaction,
    latestBlockhash: BlockhashWithExpiryBlockHeight,
  ) {
    this.transactionData = new TransactionDataDTO({
      transaction,
      latestBlockhash,
    });
  }
}
