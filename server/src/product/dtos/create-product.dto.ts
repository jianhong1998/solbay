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
  priceInMicroUsdc: number;

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
  priceInMicroUsdc: number;

  @IsBoolean()
  isPublish: boolean;

  seller?: {
    uuid: UUID;
    name: string;
  };

  constructor(product: ProductModel) {
    const { uuid, name, description, priceInMicroUsdc, isPublish, seller } =
      product;

    this.uuid = uuid;
    this.name = name;
    this.description = description;
    this.priceInMicroUsdc = priceInMicroUsdc;
    this.isPublish = isPublish;

    if (seller) {
      this.seller = {
        uuid: seller.uuid,
        name: seller.name,
      };
    }
  }
}
