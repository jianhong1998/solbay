import { ProductModel } from '../models/product.model';
import {
  IProductWithoutSensitiveData,
  ProductWithoutSensitiveData,
} from '../types/product-without-sensitive-data.type';

type IProductListWithoutDetails = Pick<
  IProductWithoutSensitiveData,
  'uuid' | 'name' | 'priceInLamport' | 'seller'
>;

export class GetProductListResDTO {
  products: IProductListWithoutDetails[];

  constructor(products: ProductModel[]) {
    this.products = products.map((product) => {
      const { name, priceInLamport, seller, uuid } =
        new ProductWithoutSensitiveData(product);

      return {
        uuid,
        name,
        priceInLamport,
        seller,
      };
    });
  }
}
