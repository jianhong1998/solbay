import { ProductModel } from '../models/product.model';
import {
  IProductWithoutSensitiveData,
  ProductWithoutSensitiveData,
} from '../types/product-without-sensitive-data.type';

type IProductListWithoutDetails = Pick<
  IProductWithoutSensitiveData,
  'uuid' | 'name' | 'priceInMicroUsdc' | 'seller'
>;

export class GetProductListResDTO {
  products: IProductListWithoutDetails[];

  constructor(products: ProductModel[]) {
    this.products = products.map((product) => {
      const { name, priceInMicroUsdc, seller, uuid } =
        new ProductWithoutSensitiveData(product);

      return {
        uuid,
        name,
        priceInMicroUsdc,
        seller,
      };
    });
  }
}
