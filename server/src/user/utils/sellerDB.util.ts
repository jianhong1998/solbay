import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseDBUtil } from 'src/common/base-classes/base-db-util';
import { EntityManager, Repository } from 'typeorm';

import { SellerModel } from '../models/seller.model';
import { UserModel } from '../models/user.model';

export type ISellerModelCreationData = Omit<SellerModel, 'uuid' | 'user'> & {
  user: UserModel;
};

@Injectable()
export class SellerDBUtil extends BaseDBUtil<
  SellerModel,
  ISellerModelCreationData
> {
  constructor(
    @InjectRepository(SellerModel)
    sellerRepo: Repository<SellerModel>,
  ) {
    super(SellerModel, sellerRepo);
  }

  public async create(params: {
    creationData: ISellerModelCreationData;
    entityManager?: EntityManager;
  }): Promise<SellerModel> {
    const { entityManager, creationData: sellerData } = params;
    const repo = entityManager?.getRepository(SellerModel) ?? this.repo;

    const seller = repo.create({
      user: sellerData.user,
      email: sellerData.email,
      name: sellerData.name,
    });

    const savedSeller = await repo.save(seller);

    return savedSeller;
  }
}
