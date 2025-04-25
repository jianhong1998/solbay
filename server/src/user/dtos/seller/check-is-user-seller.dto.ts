import { IsBoolean } from 'class-validator';

export class CheckIsUserSellerResDTO {
  @IsBoolean()
  isSeller: boolean;

  constructor(isSeller: boolean) {
    this.isSeller = isSeller;
  }
}
