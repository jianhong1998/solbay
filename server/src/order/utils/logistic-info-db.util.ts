import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseDBUtil } from 'src/shared/base-classes/base-db-util';
import { EntityManager, Repository } from 'typeorm';

import { LogisticInfoModel } from '../models/logistic-info.model';

type ILogisticInfoCreationData = Omit<
  LogisticInfoModel,
  'uuid' | 'logisticTrackingInfo'
>;

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

  // eslint-disable-next-line @typescript-eslint/require-await
  public async create(_params: {
    creationData: ILogisticInfoCreationData;
    entityManager?: EntityManager;
  }): Promise<LogisticInfoModel> {
    return new LogisticInfoModel();
  }
}
