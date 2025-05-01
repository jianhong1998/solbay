import {
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { UUID } from 'crypto';
import { IsSeller } from 'src/common/decorators/is-seller.decorator';
import { Seller } from 'src/common/decorators/seller.decorator';
import { SellerModel } from 'src/user/models/seller.model';

import { GetProductDetailsResDTO } from '../dtos/get-product-details.dto';
import { GetProductListResDTO } from '../dtos/get-product-list.dto';
import { SellerProductService } from '../services/seller-product.service';

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

  @Get('/:productId')
  public async getProductDetailsForSeller(
    @Seller() seller: SellerModel,
    @Param('productId') productId: UUID,
  ): Promise<GetProductDetailsResDTO> {
    const isCorrectSeller = await this.sellerProductService.verifyProductSeller(
      {
        productId,
        sellerId: seller.uuid,
      },
    );

    if (!isCorrectSeller) {
      throw new ForbiddenException('No permission to view this product');
    }

    const product = await this.sellerProductService.getProductDetails({
      sellerId: seller.uuid,
      criterial: {
        uuid: productId,
      },
    });

    if (!product) throw new NotFoundException(`Product does not exist`);

    return new GetProductDetailsResDTO(product);
  }
}
