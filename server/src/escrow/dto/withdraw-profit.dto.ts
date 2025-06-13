import { IsNumber, IsPositive } from 'class-validator';

export class WithdrawProfitReqDTO {
  @IsNumber()
  @IsPositive()
  amount: number;
}
