import { Controller, Get } from '@nestjs/common';
import { Public } from 'src/common/decorators';

import { GetProductListResDTO } from '../dtos/get-product-list.dto';
import { ProductService } from '../services/product.service';

@Controller('/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('/')
  @Public()
  public async getProductList(): Promise<GetProductListResDTO> {
    const products = await this.productService.getProducts({
      criterial: {
        isPublish: true,
      },
    });

    return new GetProductListResDTO(products);
  }
}
