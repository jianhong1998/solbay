import { Controller, Get } from '@nestjs/common';
import { User } from 'src/common/decorators';
import { UserModel } from 'src/user/models/user.model';

import { GetProductListResDTO } from '../dtos/get-product-list.dto';
import { SellerProductService } from '../services/seller-product.service';

// TODO: Decorator for checking user is seller
@Controller('/seller-product')
export class SellerProductController {
  constructor(private readonly sellerProductService: SellerProductService) {}

  @Get('/')
  public async getProductListBelongsToSeller(
    @User() user: UserModel,
  ): Promise<GetProductListResDTO> {
    const products = await this.sellerProductService.getProducts({
      userId: user.uuid,
    });

    return new GetProductListResDTO(products);
  }
}
