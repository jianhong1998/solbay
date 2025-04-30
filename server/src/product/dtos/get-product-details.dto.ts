import { ProductModel } from '../models/product.model';
import { IProductWithoutSensitiveData } from '../types/product-without-sensitive-data.type';

export class GetProductDetailsResDTO {
  product: IProductWithoutSensitiveData;

  constructor(product: ProductModel) {
    this.product = {
      uuid: product.uuid,
      name: product.name,
      description: product.description,
      isPublish: product.isPublish,
      priceInLamport: product.priceInLamport,
    };

    if (product.seller) {
      this.product.seller = {
        id: product.seller.uuid,
        name: product.seller.name,
      };
    }
  }
}
