import { Controller, Get } from '@nestjs/common';
import { IsSeller } from 'src/common/decorators/is-seller.decorator';
import { Seller } from 'src/common/decorators/seller.decorator';
import { SellerModel } from 'src/user/models/seller.model';

import { GetProductListResDTO } from '../dtos/get-product-list.dto';
import { SellerProductService } from '../services/seller-product.service';

// TODO: Decorator for checking user is seller
@Controller('/seller-product')
@IsSeller()
export class SellerProductController {
  constructor(private readonly sellerProductService: SellerProductService) {}

  @Get('/')
  public async getProductListBelongsToSeller(
    @Seller() seller: SellerModel,
  ): Promise<GetProductListResDTO> {
    const products = await this.sellerProductService.getProducts({
      sellerId: seller.uuid,
    });

    return new GetProductListResDTO(products);
  }
}
