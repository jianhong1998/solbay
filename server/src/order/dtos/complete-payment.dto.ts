import { ArrayNotEmpty, IsArray, IsUUID } from 'class-validator';
import { UUID } from 'crypto';

export class CompletePaymentReqDTO {
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', {
    each: true,
  })
  orderIds: UUID[];
}
