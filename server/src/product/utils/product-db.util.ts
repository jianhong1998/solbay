import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseDBUtil } from 'src/common/base-classes/base-db-util';
import { LoggerUtil } from 'src/common/utils/logger.util';
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
  priceInMicroUsdc: number;
  isPublish: boolean;
  seller: SellerModel;
};

@Injectable()
export class ProductDBUtil extends BaseDBUtil<
  ProductModel,
  IProductModelCreationData
> {
  constructor(
    private readonly loggerUtil: LoggerUtil,

    @InjectRepository(ProductModel) productRepo: Repository<ProductModel>,
  ) {
    super(ProductModel, productRepo);
  }

  public async create(params: {
    creationData: IProductModelCreationData;
    entityManager?: EntityManager;
  }): Promise<ProductModel> {
    const { entityManager, creationData: productData } = params;
    const repo = entityManager?.getRepository(ProductModel) ?? this.repo;

    const product = repo.create({
      name: productData.name,
      description: productData.description,
      priceInMicroUsdc: productData.priceInMicroUsdc,
      seller: productData.seller,
      isPublish: productData.isPublish,
    });

    const savedProduct = await repo.save(product);

    return savedProduct;
  }

  /**
   * Update product available quantity.
   * @param quantityDiff Number of difference with the current number. Positive number for addition (more availability), negative number for deduction (less availability)
   * @throws If product not found will throw error.
   * @throws If the new available quantity is negative will throw error.
   * @returns Updated product available quantity.
   */
  public async updateProductAvailableQuantity(params: {
    criterial: FindOptionsWhere<ProductModel>;
    quantityDiff: number;
    relation?: FindOptionsRelations<ProductModel>;
    entityManager?: EntityManager;
  }): Promise<number> {
    const { criterial, relation, quantityDiff, entityManager } = params;
    const repo = entityManager?.getRepository(ProductModel) ?? this.repo;
    const logger = this.loggerUtil.createLogger(
      'ProductDBUtil - updateProductAvailableQuantity',
    );

    const product = await repo.findOne({
      where: criterial,
      relations: relation,
      transaction: true,
    });

    if (!product) {
      logger.error(
        `Product not found for criterial: ${JSON.stringify(criterial)}`,
      );
      throw new Error('Product not found');
    }

    const newProductAvailableQuantity =
      product.availableQuantity + quantityDiff;

    if (product.availableQuantity < 0) {
      throw new Error(
        `Invalid new product available quantity (${newProductAvailableQuantity})`,
      );
    }

    product.availableQuantity = newProductAvailableQuantity;
    const updatedProduct = await repo.save(product, {
      transaction: true,
    });

    if (!updatedProduct) {
      logger.error(`Product ${product.uuid} not found.`);
      throw new Error('Product not found');
    }

    return updatedProduct.availableQuantity;
  }
}
