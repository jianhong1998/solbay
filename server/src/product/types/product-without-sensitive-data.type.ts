import { UUID } from 'crypto';

import { ProductModel } from '../models/product.model';

export type IProductWithoutSensitiveData = Omit<
  ProductModel,
  'seller' | 'deletedAt' | 'createdAt' | 'updatedAt'
> & {
  seller?: {
    id: UUID;
    name: string;
  };
};

export class ProductWithoutSensitiveData
  implements IProductWithoutSensitiveData
{
  uuid: UUID;
  name: string;
  description: string;
  priceInMicroUsdc: number;
  isPublish: boolean;
  availableQuantity: number;
  seller?: { id: UUID; name: string };

  constructor(product: ProductModel) {
    const {
      uuid,
      name,
      description,
      isPublish,
      priceInMicroUsdc,
      availableQuantity,
    } = product;

    this.uuid = uuid;
    this.name = name;
    this.description = description;
    this.priceInMicroUsdc = priceInMicroUsdc;
    this.isPublish = isPublish;
    this.availableQuantity = availableQuantity;

    if (product.seller) {
      this.seller = {
        id: product.seller.uuid,
        name: product.seller.name,
      };
    }
  }
}
