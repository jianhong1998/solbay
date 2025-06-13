import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { UUID } from 'crypto';
import { ProductWithoutSensitiveDataResDTO } from 'src/product/dtos/get-product-details.dto';

import { OrderStatus } from '../enums/order-status.enum';
import { OrderWithOnchainData } from '../types/order-with-onchain-data.type';

/**
 * Response DTO for Order with details
 *
 * @note Without sensitive data (logistic info, public key)
 */
export class OrderResDTO {
  @IsUUID()
  uuid: UUID;

  @IsEnum(OrderStatus)
  @IsString()
  @IsNotEmpty()
  status: OrderStatus;

  @IsNumber()
  @IsInt()
  @IsPositive()
  totalAmountInMicroUsdc: number;

  @IsNumber()
  @IsInt()
  @IsPositive()
  quantity: number;

  @ValidateNested()
  @Type(() => ProductWithoutSensitiveDataResDTO)
  product: ProductWithoutSensitiveDataResDTO;

  constructor(order: OrderWithOnchainData) {
    const { status, uuid, totalAmountInMicroUsdc, product, quantity } = order;

    this.uuid = uuid;
    this.totalAmountInMicroUsdc = totalAmountInMicroUsdc;
    this.status = status;
    this.quantity = quantity;

    if (!product) throw new Error('No product for response');
    this.product = new ProductWithoutSensitiveDataResDTO(product);
  }
}

export class GetAllOrderResDTO {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested()
  @Type(() => OrderResDTO)
  orders: OrderResDTO[];

  constructor(orders: OrderWithOnchainData[]) {
    this.orders = orders.map((order) => new OrderResDTO(order));
  }
}
