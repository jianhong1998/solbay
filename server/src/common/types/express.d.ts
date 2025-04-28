import { SellerModel } from 'src/user/models/seller.model';
import { UserModel } from 'src/user/models/user.model';

declare module 'express' {
  interface Request {
    user?: UserModel;
    seller?: SellerModel;
  }
}
