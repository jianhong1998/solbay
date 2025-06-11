import {
  BlockhashWithExpiryBlockHeight,
  VersionedTransaction,
} from '@solana/web3.js';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
  ValidateNested,
} from 'class-validator';

import { ILogisticTrackingInfoCreationData } from '../types/logistic/logistic-tracking-info-creation-data.type';
import { TransactionDataDTO } from './transaction-data.dto';

class OrderLogisticTrackingInfoCreationDTO
  implements ILogisticTrackingInfoCreationData
{
  @IsDateString()
  @IsNotEmpty()
  estimatedDeliverDate: Date;

  @IsString()
  @IsNotEmpty()
  logisticProvider: string;

  @IsString()
  @IsNotEmpty()
  trackingCode: string;

  @IsString()
  @IsUrl()
  @IsOptional()
  trackingUrl: string | null;
}

export class UpdateOrderLogisticTrackingInfoReqDTO {
  @IsObject()
  @ValidateNested()
  @Type(() => OrderLogisticTrackingInfoCreationDTO)
  logisticTrackingInfo: OrderLogisticTrackingInfoCreationDTO;
}

export class UpdateOrderLogisticTrackingInfoResDTO {
  @IsString()
  @MinLength(1)
  @IsOptional()
  additionalMessage: string | null;

  @IsObject()
  @ValidateNested()
  @Type(() => TransactionDataDTO)
  @IsOptional()
  transactionData: TransactionDataDTO | null;

  constructor(
    transactionResult: {
      transaction: VersionedTransaction;
      latestBlockhash: BlockhashWithExpiryBlockHeight;
    } | null,
    additionalMessage: string | null,
  ) {
    this.additionalMessage = additionalMessage;

    if (transactionResult) {
      this.transactionData = new TransactionDataDTO(transactionResult);
    } else {
      this.transactionData = null;
    }
  }
}
