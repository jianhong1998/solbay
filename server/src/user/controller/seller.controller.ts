import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { SellerService } from '../services/seller.service';
import {
  CreateSellerReqDTO,
  CreateSellerResDTO,
} from '../dtos/seller/create-seller.dto';
import { User } from 'src/common/decorators';
import { UserModel } from '../models/user.model';
import { CheckIsUserSellerResDTO } from '../dtos/seller/check-is-user-seller.dto';
import {
  GetSellerWithoutSensitiveDataResDTO,
  GetSellerWithSensitiveDataResDTO,
} from '../dtos/seller/get-seller.dto';

@Controller('seller')
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  @Post('/')
  public async createSeller(
    @Body() reqBody: CreateSellerReqDTO,
    @User() user: UserModel,
  ): Promise<CreateSellerResDTO> {
    const seller = await this.sellerService.createSeller({
      sellerData: {
        email: reqBody.email,
        name: reqBody.name,
        user,
      },
    });

    return new CreateSellerResDTO(seller);
  }

  @Get('/check-is-seller')
  public async checkIsUserSeller(
    @User() user: UserModel,
  ): Promise<CheckIsUserSellerResDTO> {
    const isSellerExist = await this.sellerService.isUserSeller({
      userId: user.uuid,
    });

    return new CheckIsUserSellerResDTO(isSellerExist);
  }

  @Get('/:publicKey')
  public async getSpecificSellerWithUuid(
    @Param('publicKey') sellerPublicKeyString: string,
    @User() user: UserModel,
  ): Promise<
    GetSellerWithSensitiveDataResDTO | GetSellerWithoutSensitiveDataResDTO
  > {
    const seller = await this.sellerService.getSellerByPublicKey({
      publicKey: sellerPublicKeyString,
    });

    if (!seller) {
      throw new NotFoundException('Seller not found');
    }

    if (user.uuid === seller.user?.uuid) {
      return new GetSellerWithSensitiveDataResDTO(seller);
    }

    return new GetSellerWithoutSensitiveDataResDTO(seller);
  }
}
