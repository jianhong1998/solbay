import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { UUID } from 'crypto';
import { SellerModel } from 'src/user/models/seller.model';

export class CreateSellerReqDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(100)
  email: string;
}

export class CreateSellerResDTO {
  uuid: UUID;
  name: string;
  email: string;

  constructor(seller: SellerModel) {
    this.uuid = seller.uuid;
    this.name = seller.name;
    this.email = seller.email;
  }
}
