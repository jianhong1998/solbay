import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { UUID } from 'crypto';
import { Public } from 'src/common/decorators';
import { MoreThanOrEqual } from 'typeorm';
import { validate } from 'uuid';

import { GetProductDetailsResDTO } from '../dtos/get-product-details.dto';
import { GetProductListResDTO } from '../dtos/get-product-list.dto';
import { ProductService } from '../services/product.service';

@Controller('/product')
export class BuyerProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('/')
  @Public()
  public async getProductList(): Promise<GetProductListResDTO> {
    const products = await this.productService.getProducts({
      criterial: {
        isPublish: true,
        availableQuantity: MoreThanOrEqual(1),
      },
    });

    return new GetProductListResDTO(products);
  }

  @Get('/:productId')
  @Public()
  public async getProductDetailsForSeller(
    @Param('productId') productId: UUID,
  ): Promise<GetProductDetailsResDTO> {
    if (!validate(productId)) {
      throw new NotFoundException('Product does not exist');
    }

    const product = await this.productService.getProductDetails({
      criterial: {
        uuid: productId,
      },
    });

    if (!product) throw new NotFoundException(`Product does not exist`);

    return new GetProductDetailsResDTO(product);
  }
}
