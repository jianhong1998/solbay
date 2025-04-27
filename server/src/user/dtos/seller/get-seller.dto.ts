import { SellerModel } from 'src/user/models/seller.model';

export class GetSellerWithoutSensitiveDataResDTO {
  uuid: string;
  name: string;

  constructor(seller: SellerModel) {
    this.uuid = seller.uuid;
    this.name = seller.name;
  }
}

export class GetSellerWithSensitiveDataResDTO {
  uuid: string;
  name: string;
  email: string;

  constructor(seller: SellerModel) {
    this.uuid = seller.uuid;
    this.name = seller.name;
    this.email = seller.email;
  }
}
