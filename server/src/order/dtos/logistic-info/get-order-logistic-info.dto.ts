import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { UUID } from 'crypto';
import { LogisticInfoModel } from 'src/order/models/logistic-info.model';

export class GetOrderLogisticInfoResDTO {
  @IsUUID()
  uuid: UUID;

  @IsString()
  @IsNotEmpty()
  recipientName: string;

  @IsInt()
  @Min(1)
  countryCode: number;

  @IsInt()
  @Min(1)
  contactNumber: number;

  @IsString()
  @IsNotEmpty()
  streetLine1: string;

  @IsString()
  @IsOptional()
  streetLine2: string | null;

  @IsString()
  @IsOptional()
  streetLine3: string | null;

  @IsInt()
  @Min(1)
  postalCode: number;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  constructor(logisticInfo: LogisticInfoModel) {
    const {
      uuid,
      recipientName,
      countryCode,
      contactNumber,
      streetLine1,
      streetLine2,
      streetLine3,
      postalCode,
      city,
      country,
    } = logisticInfo;

    this.uuid = uuid;
    this.recipientName = recipientName;
    this.countryCode = countryCode;
    this.contactNumber = contactNumber;
    this.streetLine1 = streetLine1;
    this.streetLine2 = streetLine2;
    this.streetLine3 = streetLine3;
    this.postalCode = postalCode;
    this.city = city;
    this.country = country;
  }
}
