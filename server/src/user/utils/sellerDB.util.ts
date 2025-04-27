import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EntityManager,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { SellerModel } from '../models/seller.model';
import { UserModel } from '../models/user.model';

export type ISellerModelCreationData = Omit<SellerModel, 'uuid' | 'user'> & {
  user: UserModel;
};

@Injectable()
export class SellerDBUtil {
  constructor(
    @InjectRepository(SellerModel)
    private readonly sellerRepo: Repository<SellerModel>,
  ) {}

  public async getOne(params: {
    criterial: FindOptionsWhere<SellerModel>;
    entityManager?: EntityManager;
    relation?: FindOptionsRelations<SellerModel>;
    withDeleted?: boolean;
  }): Promise<SellerModel | null> {
    const { criterial, entityManager, relation, withDeleted } = params;
    const repo = entityManager?.getRepository(SellerModel) ?? this.sellerRepo;

    const seller = await repo.findOne({
      where: criterial,
      transaction: true,
      relations: relation,
      withDeleted,
    });

    return seller;
  }

  public async getAll(options?: {
    entityManager?: EntityManager;
    relation?: FindOptionsRelations<SellerModel>;
    credential?: FindOptionsWhere<SellerModel>;
  }) {
    const repo =
      options?.entityManager?.getRepository(SellerModel) ?? this.sellerRepo;

    const sellers = await repo.find({
      where: options?.credential,
      relations: options?.relation,
      transaction: true,
    });

    return sellers;
  }

  public async has(params: {
    criterial: FindOptionsWhere<SellerModel>;
    entityManager?: EntityManager;
    relation?: FindOptionsRelations<SellerModel>;
  }): Promise<boolean> {
    const { criterial, entityManager, relation } = params;
    const repo = entityManager?.getRepository(SellerModel) ?? this.sellerRepo;

    const count = await repo.count({
      where: criterial,
      relations: relation,
    });

    return count > 0;
  }

  public async create(params: {
    sellerData: ISellerModelCreationData;
    entityManager?: EntityManager;
  }): Promise<SellerModel> {
    const { entityManager, sellerData } = params;
    const repo = entityManager?.getRepository(SellerModel) ?? this.sellerRepo;

    const seller = repo.create({
      user: sellerData.user,
      email: sellerData.email,
      name: sellerData.name,
    });

    const savedSeller = await repo.save(seller);

    return savedSeller;
  }
}
