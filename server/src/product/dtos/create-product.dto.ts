import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';
import { UUID } from 'crypto';

import { ProductModel } from '../models/product.model';

export class CreateProductReqDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsInt()
  @IsPositive()
  priceInLamport: number;

  @IsBoolean()
  @IsNotEmpty()
  isPublish: boolean;
}

export class CreateProductResDTO {
  @IsUUID()
  @IsNotEmpty()
  uuid: UUID;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsInt()
  @IsPositive()
  priceInLamport: number;

  @IsBoolean()
  isPublish: boolean;

  seller?: {
    uuid: UUID;
    name: string;
  };

  constructor(product: ProductModel) {
    const { uuid, name, description, priceInLamport, isPublish, seller } =
      product;

    this.uuid = uuid;
    this.name = name;
    this.description = description;
    this.priceInLamport = priceInLamport;
    this.isPublish = isPublish;

    if (seller) {
      this.seller = {
        uuid: seller.uuid,
        name: seller.name,
      };
    }
  }
}
