import { InjectRepository } from '@nestjs/typeorm';
import { BaseDBUtil } from 'src/common/base-classes/base-db-util';
import {
  EntityManager,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { TempOrderModel } from '../models/temp-order.model';
import { ITempOrderModelCreationData } from '../types/temp-order-model-creation-data.type';

export class TempOrderDBUtil extends BaseDBUtil<
  TempOrderModel,
  ITempOrderModelCreationData
> {
  constructor(
    @InjectRepository(TempOrderModel) repo: Repository<TempOrderModel>,
  ) {
    super(TempOrderModel, repo);
  }

  public async create(params: {
    creationData: ITempOrderModelCreationData;
    entityManager?: EntityManager;
  }): Promise<TempOrderModel> {
    const { creationData, entityManager } = params;
    const repo = entityManager?.getRepository(TempOrderModel) ?? this.repo;

    const tempOrder = repo.create({
      buyer: creationData.buyer,
      order: creationData.order,
    });

    return await repo.save(tempOrder);
  }

  public async delete(params: {
    criterial: FindOptionsWhere<TempOrderModel>;
    entityManager?: EntityManager;
    relation?: FindOptionsRelations<TempOrderModel> | undefined;
  }): Promise<TempOrderModel[] | null> {
    const { criterial, entityManager, relation } = params;

    const repo = entityManager?.getRepository(TempOrderModel) ?? this.repo;

    const existingData = await repo.find({
      where: criterial,
      relations: relation,
    });

    if (!existingData.length) return null;

    return await repo.remove(existingData);
  }
}
