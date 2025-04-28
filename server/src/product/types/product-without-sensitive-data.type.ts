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
  priceInLamport: number;
  isPublish: boolean;
  seller?: { id: UUID; name: string };

  constructor(product: ProductModel) {
    const { uuid, name, description, isPublish, priceInLamport } = product;

    this.uuid = uuid;
    this.name = name;
    this.description = description;
    this.priceInLamport = priceInLamport;
    this.isPublish = isPublish;

    if (product.seller) {
      this.seller = {
        id: product.seller.uuid,
        name: product.seller.name,
      };
    }
  }
}
