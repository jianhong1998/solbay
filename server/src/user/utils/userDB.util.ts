import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EntityManager,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { UserModel } from '../models/user.model';

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
}
