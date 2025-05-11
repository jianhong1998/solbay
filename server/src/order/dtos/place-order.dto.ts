import { Type } from 'class-transformer';
import {
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
  @IsUUID()
  productId: UUID;

  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsObject()
  @ValidateNested()
  @Type(() => LogisticInfoCreationDTO)
  logisticInfo: LogisticInfoCreationDTO;
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
  @IsString()
  transaction: string;

  @IsObject()
  @ValidateNested()
  @Type(() => OrderDTO)
  order: OrderDTO;

  constructor(params: {
    serializedTransaction: string;
    order: OrderModel;
    orderStatus: OrderStatus;
  }) {
    const { order, serializedTransaction, orderStatus } = params;

    this.transaction = serializedTransaction;
    this.order = new OrderDTO(order, orderStatus);
  }
}
