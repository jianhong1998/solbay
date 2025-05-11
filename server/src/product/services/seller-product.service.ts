import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { UUID } from 'crypto';
import { SellerModel } from 'src/user/models/seller.model';
import { SellerDBUtil } from 'src/user/utils/sellerDB.util';
import { EntityManager, FindOptionsWhere } from 'typeorm';

import { ProductModel } from '../models/product.model';
import {
  IProductModelCreationData,
  ProductDBUtil,
} from '../utils/product-db.util';

type IProductCreationData = Omit<IProductModelCreationData, 'seller'>;

@Injectable()
export class SellerProductService {
  constructor(
    private readonly productDBUtil: ProductDBUtil,
    private readonly sellerDBUtil: SellerDBUtil,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {}

  public async getProducts(params: {
    sellerId: UUID;
    criterial?: FindOptionsWhere<ProductModel>;
    entityManger?: EntityManager;
  }): Promise<ProductModel[]> {
    const { criterial, sellerId } = params;
    const entityManager = params.entityManger ?? this.entityManager;

    const productList = await this.productDBUtil.getAll({
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

  public async getProductDetails(params: {
    sellerId: UUID;
    criterial: FindOptionsWhere<ProductModel>;
    entityManger?: EntityManager;
  }): Promise<ProductModel | null> {
    const { criterial, sellerId } = params;
    const entityManager = params.entityManger ?? this.entityManager;

    const product = await this.productDBUtil.getOne({
      criterial: {
        ...criterial,
        seller: {
          uuid: sellerId,
        },
      },
      entityManager,
      relation: {
        seller: true,
      },
    });

    return product;
  }

  public async verifyProductSeller(params: {
    productId: UUID;
    sellerId: UUID;
    entityMamanger?: EntityManager;
  }): Promise<boolean> {
    const { productId, sellerId } = params;
    const entityManager = params.entityMamanger ?? this.entityManager;

    const isProductSoldBySeller = await this.sellerDBUtil.has({
      criterial: {
        uuid: sellerId,
        products: {
          uuid: productId,
        },
      },
      entityManager,
      relation: {
        products: true,
      },
    });

    return isProductSoldBySeller;
  }

  public async createProduct(params: {
    seller: SellerModel;
    productData: IProductCreationData;
    entityManager?: EntityManager;
  }) {
    const {
      productData: { description, name, priceInMicroUsdc, isPublish },
      seller,
    } = params;
    const entityManager = params?.entityManager ?? this.entityManager;

    const product = await this.productDBUtil.create({
      creationData: {
        seller,
        name,
        description,
        priceInMicroUsdc,
        isPublish,
      },
      entityManager,
    });

    return product;
  }
}
