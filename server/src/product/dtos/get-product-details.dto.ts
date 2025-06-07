import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { UUID } from 'crypto';
import { SellerModel } from 'src/user/models/seller.model';

import { ProductModel } from '../models/product.model';
import { IProductWithoutSensitiveData } from '../types/product-without-sensitive-data.type';

class SellerDTO {
  @IsUUID()
  id: UUID;

  @IsString()
  @IsNotEmpty()
  name: string;
  constructor(seller: SellerModel) {
    this.id = seller.uuid;
    this.name = seller.name;
  }
}

export class ProductWithoutSensitiveDataResDTO
  implements IProductWithoutSensitiveData
{
  @IsNumber()
  @IsPositive()
  availableQuantity: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsBoolean()
  isPublish: boolean;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsPositive()
  priceInMicroUsdc: number;

  @IsUUID()
  uuid: `${string}-${string}-${string}-${string}-${string}`;

  @ValidateNested()
  @Type(() => SellerDTO)
  seller?: SellerDTO;

  constructor(product: ProductModel) {
    this.uuid = product.uuid;
    this.name = product.name;
    this.description = product.description;
    this.isPublish = product.isPublish;
    this.priceInMicroUsdc = product.priceInMicroUsdc;
    this.availableQuantity = product.availableQuantity;

    if (product.seller) {
      this.seller = new SellerDTO(product.seller);
    }
  }
}

export class GetProductDetailsResDTO {
  product: ProductWithoutSensitiveDataResDTO;

  constructor(product: ProductModel) {
    this.product = new ProductWithoutSensitiveDataResDTO(product);
  }
}
