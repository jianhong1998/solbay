import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, FindOptionsWhere } from 'typeorm';

import { ProductModel } from '../models/product.model';
import { ProductDBUtil } from '../utils/product-db.util';

@Injectable()
export class ProductService {
  constructor(
    private readonly productDbUtil: ProductDBUtil,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {}

  public async getProducts(params: {
    criterial?: FindOptionsWhere<ProductModel>;
    entityManger?: EntityManager;
  }): Promise<ProductModel[]> {
    const { criterial } = params;
    const entityManager = params.entityManger ?? this.entityManager;

    const productList = await this.productDbUtil.getAll({
      criterial,
      entityManager,
      relation: {
        seller: true,
      },
    });

    return productList;
  }

  public async getProductDetails(params: {
    criterial: FindOptionsWhere<ProductModel>;
    entityManager?: EntityManager;
  }): Promise<ProductModel | null> {
    const { criterial } = params;
    const entityManager = params.entityManager ?? this.entityManager;

    const product = await this.productDbUtil.getOne({
      criterial,
      entityManager,
      relation: {
        seller: true,
      },
    });

    return product;
  }
}
