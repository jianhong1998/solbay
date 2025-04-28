import { createParamDecorator } from '@nestjs/common';
import { Request } from 'express';
import { SellerModel } from 'src/user/models/seller.model';

export const Seller = createParamDecorator<never, SellerModel | undefined>(
  (_data, context) => {
    const req = context.switchToHttp().getRequest<Request>();
    const seller = req.seller;

    return seller;
  },
);
