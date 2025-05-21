import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { UUID } from 'crypto';
import { Public } from 'src/common/decorators';
import { Seller } from 'src/common/decorators/seller.decorator';
import { SellerModel } from 'src/user/models/seller.model';
import { FindOptionsWhere, MoreThanOrEqual, Not } from 'typeorm';
import { validate } from 'uuid';

import { GetProductDetailsResDTO } from '../dtos/get-product-details.dto';
import { GetProductListResDTO } from '../dtos/get-product-list.dto';
import { ProductModel } from '../models/product.model';
import { ProductService } from '../services/product.service';

@Controller('/product')
export class BuyerProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('/')
  @Public()
  public async getProductList(
    @Seller() seller: SellerModel | undefined,
  ): Promise<GetProductListResDTO> {
    const criterial: FindOptionsWhere<ProductModel> = {
      isPublish: true,
      availableQuantity: MoreThanOrEqual(1),
    };

    if (seller) {
      criterial.seller = {
        uuid: Not(seller.uuid),
      };
    }

    const products = await this.productService.getProducts({
      criterial,
    });

    return new GetProductListResDTO(products);
  }

  @Get('/:productId')
  @Public()
  public async getProductDetailsForSeller(
    @Param('productId') productId: UUID,
    @Seller() seller: SellerModel | undefined,
  ): Promise<GetProductDetailsResDTO> {
    if (!validate(productId)) {
      throw new NotFoundException('Product does not exist');
    }

    const product = await this.productService.getProductDetails({
      criterial: {
        uuid: productId,
        seller: {
          uuid: seller ? Not(seller?.uuid) : undefined,
        },
      },
    });

    if (!product) throw new NotFoundException(`Product does not exist`);

    return new GetProductDetailsResDTO(product);
  }
}
