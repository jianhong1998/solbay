import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeepPartial,
  EntityManager,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { UserModel } from '../models/user.model';

type IUserModelCreationData = {
  publicKey: string;
};

@Injectable()
export class UserDBUtil {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepo: Repository<UserModel>,
  ) {}

  public async getOne(params: {
    criterial: FindOptionsWhere<UserModel>;
    entityManager?: EntityManager;
    relation?: FindOptionsRelations<UserModel>;
  }): Promise<UserModel | null> {
    const { criterial, entityManager, relation } = params;
    const repo = entityManager?.getRepository(UserModel) ?? this.userRepo;

    const user = await repo.findOne({
      where: criterial,
      transaction: true,
      relations: relation,
    });

    return user;
  }

  public async getAll(options?: {
    entityManager?: EntityManager;
    relation?: FindOptionsRelations<UserModel>;
    credential?: FindOptionsWhere<UserModel>;
  }) {
    const repo =
      options?.entityManager?.getRepository(UserModel) ?? this.userRepo;

    const users = await repo.find({
      where: options?.credential,
      relations: options?.relation,
      transaction: true,
    });

    return users;
  }

  public async has(params: {
    criterial: FindOptionsWhere<UserModel>;
    entityManager?: EntityManager;
    relation?: FindOptionsRelations<UserModel>;
  }): Promise<boolean> {
    const { criterial, entityManager, relation } = params;
    const repo = entityManager?.getRepository(UserModel) ?? this.userRepo;

    const count = await repo.count({
      where: criterial,
      relations: relation,
    });

    return count > 0;
  }

  public async create(params: {
    userData: IUserModelCreationData;
    entityManager?: EntityManager;
  }): Promise<UserModel> {
    const {
      entityManager,
      userData: { publicKey },
    } = params;
    const repo = entityManager?.getRepository(UserModel) ?? this.userRepo;
    const user = await repo.save(repo.create({ publicKey }));
    return user;
  }
}
