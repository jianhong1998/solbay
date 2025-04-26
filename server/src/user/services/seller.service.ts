import { ConflictException, Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { UUID } from 'crypto';
import { LoggerUtil } from 'src/common/utils/logger.util';
import { EntityManager } from 'typeorm';

import { SellerModel } from '../models/seller.model';
import { ISellerModelCreationData, SellerDBUtil } from '../utils/sellerDB.util';

@Injectable()
export class SellerService {
  constructor(
    private readonly loggerUtil: LoggerUtil,
    private readonly sellerDbUtil: SellerDBUtil,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {}

  public async createSeller(params: {
    entityManager?: EntityManager;
    sellerData: ISellerModelCreationData;
  }): Promise<SellerModel> {
    const { sellerData } = params;
    const entityManager = params.entityManager ?? this.entityManager;

    const isSellerExist = await this.sellerDbUtil.has({
      criterial: {
        user: {
          uuid: sellerData.user.uuid,
        },
      },
      entityManager,
      relation: {
        user: true,
      },
    });

    if (isSellerExist) {
      throw new ConflictException('Seller already exist');
    }

    const createdSeller = await this.sellerDbUtil.create({
      sellerData,
      entityManager,
    });

    return createdSeller;
  }

  public async isUserSeller(params: {
    userId: UUID;
    entityManager?: EntityManager;
  }): Promise<boolean> {
    const { userId } = params;
    const entityManager = params.entityManager ?? this.entityManager;

    const isSellerExist = this.sellerDbUtil.has({
      criterial: {
        user: {
          uuid: userId,
        },
      },
      entityManager,
      relation: {
        user: true,
      },
    });

    return isSellerExist;
  }

  public async getSellerByPublicKey(params: {
    publicKey: string;
    entityManager?: EntityManager;
  }): Promise<SellerModel | null> {
    const { publicKey: publicKeyString } = params;
    const entityManager = params.entityManager ?? this.entityManager;

    const seller = await this.sellerDbUtil.getOne({
      criterial: {
        user: {
          publicKey: publicKeyString,
        },
      },
      entityManager,
      relation: {
        user: true,
      },
    });

    return seller;
  }
}
