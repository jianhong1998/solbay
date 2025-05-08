import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { PublicKey } from '@solana/web3.js';
import { LoggerUtil } from 'src/common/utils/logger.util';
import { EntityManager } from 'typeorm';

import { UserModel } from '../models/user.model';
import { UserDBUtil } from '../utils/userDB.util';

@Injectable()
export class UserService {
  constructor(
    private readonly userDbUtil: UserDBUtil,
    private readonly loggerUtil: LoggerUtil,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {}

  public async createUserIfNotExist(params: {
    publicKey: PublicKey;
    entityManager?: EntityManager;
  }): Promise<void> {
    const { publicKey } = params;
    const entityManager = params.entityManager ?? this.entityManager;
    const publicKeyString = publicKey.toBase58();
    const logger = this.loggerUtil.createLogger('Create User If Not Exist');

    const isUserExist = await this.userDbUtil.has({
      entityManager,
      criterial: {
        publicKey: publicKeyString,
      },
    });

    if (!isUserExist) {
      logger.log(
        `User "${publicKeyString}" does not exist in database, creating user data...`,
      );

      await this.userDbUtil.create({
        entityManager,
        creationData: {
          publicKey: publicKeyString,
        },
      });

      logger.log(`User "${publicKeyString}" is created.`);
    }
  }

  public async getUserByPublicKey(params: {
    entityManager?: EntityManager;
    publicKey: PublicKey;
  }): Promise<UserModel | null> {
    const { publicKey } = params;
    const entityManager = params.entityManager ?? this.entityManager;

    const user = await this.userDbUtil.getOne({
      criterial: {
        publicKey: publicKey.toBase58(),
      },
      entityManager,
    });

    return user;
  }
}
