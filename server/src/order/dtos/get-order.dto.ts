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
import { OrderWithStatus } from '../types/order-with-status.type';

/**
 * Response DTO for Order without details
 */
class OrderResDTO {
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

  constructor(order: OrderWithStatus) {
    const { status, uuid, totalAmountInMicroUsdc, product, quantity } = order;

    if (!product) throw new Error('No product for response');
    this.product = new ProductWithoutSensitiveDataResDTO(product);

    this.uuid = uuid;
    this.totalAmountInMicroUsdc = totalAmountInMicroUsdc;
    this.status = status;
    this.quantity = quantity;
  }
}

export class GetAllOrderResDTO {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested()
  @Type(() => OrderResDTO)
  orders: OrderResDTO[];

  constructor(orders: OrderWithStatus[]) {
    this.orders = orders.map((order) => new OrderResDTO(order));
  }
}
