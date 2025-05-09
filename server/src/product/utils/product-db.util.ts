import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseDBUtil } from 'src/shared/base-classes/base-db-util';
import { SellerModel } from 'src/user/models/seller.model';
import { EntityManager, Repository } from 'typeorm';

import { ProductModel } from '../models/product.model';

export type IProductModelCreationData = {
  name: string;
  description: string;
  priceInLamport: number;
  isPublish: boolean;
  seller: SellerModel;
};

@Injectable()
export class ProductDBUtil extends BaseDBUtil<
  ProductModel,
  IProductModelCreationData
> {
  constructor(
    @InjectRepository(ProductModel)
    private readonly productRepo: Repository<ProductModel>,
  ) {
    super(ProductModel, productRepo);
  }

  public async create(params: {
    creationData: IProductModelCreationData;
    entityManager?: EntityManager;
  }): Promise<ProductModel> {
    const { entityManager, creationData: productData } = params;
    const repo = entityManager?.getRepository(ProductModel) ?? this.productRepo;

    const product = repo.create({
      name: productData.name,
      description: productData.description,
      priceInLamport: productData.priceInLamport,
      seller: productData.seller,
      isPublish: productData.isPublish,
    });

    const savedProduct = await repo.save(product);

    return savedProduct;
  }
}
