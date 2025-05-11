import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { UUID } from 'crypto';
import { LoggerUtil } from 'src/common/utils/logger.util';
import { EntityManager, FindOptionsWhere } from 'typeorm';

import { ProductModel } from '../models/product.model';
import { ProductDBUtil } from '../utils/product-db.util';

@Injectable()
export class ProductService {
  private readonly productErrorMessages = {
    productNotFound: 'Product is not found.',
  };

  constructor(
    private readonly productDbUtil: ProductDBUtil,
    private readonly loggerUtil: LoggerUtil,
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

  public async reserveProduct(params: {
    productId: UUID;
    quantity: number;
    entityManager?: EntityManager;
  }): Promise<void> {
    const { productId, quantity } = params;
    const entityManager = params.entityManager ?? this.entityManager;
    const logger = this.loggerUtil.createLogger('Reserve Product Service');

    const product = await this.getProductDetails({
      criterial: {
        uuid: productId,
      },
      entityManager,
    });

    if (!product) {
      logger.warn(`Reserving a product (${productId}) does not exist.`);
      throw new NotFoundException(this.productErrorMessages.productNotFound);
    }

    if (!product.isPublish) {
      logger.warn(`Reserving a product (${productId}) does not published.`);
      throw new NotFoundException(this.productErrorMessages.productNotFound);
    }

    if (product.availableQuantity < quantity) {
      logger.warn(
        `Requested to reserve ${quantity} of product (${productId}) but product only available for ${product.availableQuantity}`,
      );
      throw new ConflictException(
        `Product available quantit is less than ${quantity}`,
      );
    }

    await this.productDbUtil.updateProductAvailableQuantity({
      criterial: {
        uuid: product.uuid,
      },
      quantityDiff: -quantity,
      entityManager,
    });
  }
}
