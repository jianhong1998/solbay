import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseDBUtil } from 'src/common/base-classes/base-db-util';
import { EntityManager, Repository } from 'typeorm';

import { LogisticInfoModel } from '../models/logistic-info.model';
import { ILogisticInfoCreationData } from '../types/logistic/logistic-info-creation-data.type';

@Injectable()
export class LogisticInfoDBUtil extends BaseDBUtil<
  LogisticInfoModel,
  ILogisticInfoCreationData
> {
  constructor(
    @InjectRepository(LogisticInfoModel)
    orderRepo: Repository<LogisticInfoModel>,
  ) {
    super(LogisticInfoModel, orderRepo);
  }

  public async create(params: {
    creationData: ILogisticInfoCreationData;
    entityManager?: EntityManager;
  }): Promise<LogisticInfoModel> {
    const {
      creationData: {
        recipientName,
        contactNumber,
        countryCode,
        streetLine1,
        streetLine2,
        streetLine3,
        postalCode,
        country,
        city,
      },
      entityManager,
    } = params;
    const repo = entityManager?.getRepository(LogisticInfoModel) ?? this.repo;

    if (!recipientName)
      throw new Error(`Invalid recipientName (${recipientName}).`);
    if (contactNumber <= 0)
      throw new Error(`Invalid contactNumber (${contactNumber}).`);
    if (countryCode <= 0)
      throw new Error(`Invalid countryCode (${countryCode}).`);
    if (!streetLine1) throw new Error(`Invalid streetLine1 (${streetLine1}).`);
    if (typeof streetLine2 === 'string' && !streetLine2.length)
      throw new Error(`Invalid streetLine2: Length must be greather than 0.`);
    if (typeof streetLine3 === 'string' && !streetLine3.length)
      throw new Error(`Invalid streetLine3: Length must be greather than 0.`);
    if (postalCode <= 0) throw new Error(`Invalid postalCode (${postalCode}).`);
    if (!country) throw new Error(`Invalid country (${country}).`);
    if (!city) throw new Error(`Invalid city (${city}).`);

    const logisticInfo = repo.create({
      recipientName,
      contactNumber,
      countryCode,
      streetLine1,
      streetLine2,
      streetLine3,
      postalCode,
      city,
      country,
    });

    return await repo.save(logisticInfo);
  }
}
