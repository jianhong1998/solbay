import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseDBUtil } from 'src/shared/base-classes/base-db-util';
import { EntityManager, Repository } from 'typeorm';

import { UserModel } from '../models/user.model';

type IUserModelCreationData = {
  publicKey: string;
};

@Injectable()
export class UserDBUtil extends BaseDBUtil<UserModel, IUserModelCreationData> {
  constructor(
    @InjectRepository(UserModel)
    userRepo: Repository<UserModel>,
  ) {
    super(UserModel, userRepo);
  }

  public async create(params: {
    creationData: IUserModelCreationData;
    entityManager?: EntityManager;
  }): Promise<UserModel> {
    const {
      entityManager,
      creationData: { publicKey },
    } = params;
    const repo = entityManager?.getRepository(UserModel) ?? this.repo;
    const user = await repo.save(repo.create({ publicKey }));
    return user;
  }
}
