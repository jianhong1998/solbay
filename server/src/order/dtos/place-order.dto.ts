import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { UUID } from 'crypto';

import { OrderStatus } from '../enums/order-status.enum';
import { OrderModel } from '../models/order.model';
import { ILogisticInfoCreationData } from '../types/logistic/logistic-info-creation-data.type';

class LogisticInfoCreationDTO implements ILogisticInfoCreationData {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  recipientName: string;

  @IsNumber()
  @IsPositive()
  contactNumber: number;

  @IsNumber()
  @IsPositive()
  countryCode: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  streetLine1: string;

  @IsString()
  @MaxLength(100)
  @IsOptional()
  streetLine2: string | null;

  @IsString()
  @MaxLength(100)
  @IsOptional()
  streetLine3: string | null;

  @IsNumber()
  @IsPositive()
  postalCode: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  city: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  country: string;
}

export class CheckoutReqDTO {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ProductQuantityDTO)
  productQuantities: ProductQuantityDTO[];

  @IsObject()
  @ValidateNested()
  @Type(() => LogisticInfoCreationDTO)
  logisticInfo: LogisticInfoCreationDTO;
}

class ProductQuantityDTO {
  @IsUUID()
  productId: UUID;

  @IsNumber()
  @IsPositive()
  quantity: number;
}

class OrderDTO {
  @IsUUID()
  uuid: UUID;

  @IsNumber()
  quantity: number;

  @IsNumber()
  totalAmountInMicroUsdc: number;

  @IsEnum(OrderStatus)
  status: OrderStatus;

  constructor(order: OrderModel, orderStatus: OrderStatus) {
    this.status = orderStatus;

    this.uuid = order.uuid;
    this.quantity = order.quantity;
    this.totalAmountInMicroUsdc = order.totalAmountInMicroUsdc;
  }
}

export class CheckoutResDTO {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested()
  @Type(() => OrderDTO)
  orders: OrderDTO[];

  constructor(params: { orders: OrderModel[]; orderStatus: OrderStatus }) {
    const { orders, orderStatus } = params;

    this.orders = orders.map((order) => new OrderDTO(order, orderStatus));
  }
}
