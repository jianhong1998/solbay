import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SellerModel } from 'src/user/models/seller.model';
import {
  EntityManager,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { ProductModel } from '../models/product.model';

export type IProductModelCreationData = {
  name: string;
  description: string;
  priceInLamport: number;
  isPublish: boolean;
  seller: SellerModel;
};

@Injectable()
export class ProductDBUtil {
  constructor(
    @InjectRepository(ProductModel)
    private readonly productRepo: Repository<ProductModel>,
  ) {}

  public async getOne(params: {
    criterial: FindOptionsWhere<ProductModel>;
    entityManager?: EntityManager;
    relation?: FindOptionsRelations<ProductModel>;
    withDeleted?: boolean;
  }): Promise<ProductModel | null> {
    const { criterial, entityManager, relation, withDeleted } = params;
    const repo = entityManager?.getRepository(ProductModel) ?? this.productRepo;

    const product = await repo.findOne({
      where: criterial,
      transaction: true,
      relations: relation,
      withDeleted,
    });

    return product;
  }

  public async getAll(options?: {
    entityManager?: EntityManager;
    relation?: FindOptionsRelations<ProductModel>;
    criterial?: FindOptionsWhere<ProductModel>;
  }) {
    const repo =
      options?.entityManager?.getRepository(ProductModel) ?? this.productRepo;

    const products = await repo.find({
      where: options?.criterial,
      relations: options?.relation,
      transaction: true,
    });

    return products;
  }

  public async has(params: {
    criterial: FindOptionsWhere<ProductModel>;
    entityManager?: EntityManager;
    relation?: FindOptionsRelations<ProductModel>;
  }): Promise<boolean> {
    const { criterial, entityManager, relation } = params;
    const repo = entityManager?.getRepository(ProductModel) ?? this.productRepo;

    const count = await repo.count({
      where: criterial,
      relations: relation,
    });

    return count > 0;
  }

  public async create(params: {
    productData: IProductModelCreationData;
    entityManager?: EntityManager;
  }): Promise<ProductModel> {
    const { entityManager, productData } = params;
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
