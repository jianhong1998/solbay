import { Body, Controller, Post } from '@nestjs/common';
import { SellerService } from '../services/seller.service';
import {
  CreateSellerReqDTO,
  CreateSellerResDTO,
} from '../dtos/seller/create-seller.dto';
import { User } from 'src/common/decorators';
import { UserModel } from '../models/user.model';

@Controller('seller')
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  @Post('/')
  public async createSeller(
    @Body() reqBody: CreateSellerReqDTO,
    @User() user: UserModel,
  ) {
    const seller = await this.sellerService.createSeller({
      sellerData: {
        email: reqBody.email,
        name: reqBody.name,
        user,
      },
    });

    return new CreateSellerResDTO(seller);
  }
}
