import { VersionedTransaction } from '@solana/web3.js';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Length,
  ValidateNested,
} from 'class-validator';
import { UUID } from 'crypto';
import { TransactionUtil } from 'src/solana-connection/utils/transaction.util';

export class CreatePaymentReqDTO {
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  orderIds: UUID[];
}

type ICreatePaymentResDTOParams = {
  transaction: VersionedTransaction | null;
  latestBlockhash: { blockhash: string; lastValidBlockHeight: number } | null;
};

class LatestBlockhash {
  @IsString()
  @IsNotEmpty()
  blockhash: string;

  @IsNumber()
  @IsPositive()
  @IsInt()
  lastValidBlockHeight: number;
}

export class CreatePaymentResDTO {
  @IsString()
  @Length(1)
  @IsOptional()
  transaction: string | null;

  @IsObject()
  @ValidateNested()
  @Type(() => LatestBlockhash)
  @IsOptional()
  latestBlockhash: LatestBlockhash | null;

  constructor(params: ICreatePaymentResDTOParams) {
    const { latestBlockhash, transaction } = params;

    this.transaction = transaction
      ? TransactionUtil.serializeTransaction(transaction)
      : null;

    this.latestBlockhash = latestBlockhash
      ? {
          blockhash: latestBlockhash.blockhash,
          lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        }
      : null;
  }
}
