import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { UUID } from 'crypto';
import { EntityManager, FindOptionsWhere } from 'typeorm';

import { ProductModel } from '../models/product.model';
import { ProductDBUtil } from '../utils/product-db.util';

@Injectable()
export class SellerProductService {
  constructor(
    private readonly productDbUtil: ProductDBUtil,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {}

  public async getProducts(params: {
    sellerId: UUID;
    criterial?: FindOptionsWhere<ProductModel>;
    entityManger?: EntityManager;
  }): Promise<ProductModel[]> {
    const { criterial, sellerId } = params;
    const entityManager = params.entityManger ?? this.entityManager;

    const productList = await this.productDbUtil.getAll({
      criterial: {
        ...criterial,
        seller: {
          uuid: sellerId,
        },
      },
      entityManager,
      relation: {
        seller: {
          user: true,
        },
      },
    });

    return productList;
  }
}
