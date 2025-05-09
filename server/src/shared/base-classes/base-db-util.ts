import { ModelConstructorType } from 'src/database/entity-model';
import {
  EntityManager,
  EntityTarget,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

export abstract class BaseDBUtil<
  ModelType extends InstanceType<ModelConstructorType>,
  CreationDataType extends object,
> {
  constructor(
    private readonly model: EntityTarget<ModelType>,
    protected readonly repo: Repository<ModelType>,
  ) {}

  public async getOne(params: {
    criterial: FindOptionsWhere<ModelType>;
    entityManager?: EntityManager;
    relation?: FindOptionsRelations<ModelType>;
    withDeleted?: boolean;
  }): Promise<ModelType | null> {
    const { criterial, entityManager, relation, withDeleted } = params;
    const repo =
      (entityManager?.getRepository(this.model) as Repository<ModelType>) ??
      this.repo;

    return await repo.findOne({
      where: criterial,
      transaction: true,
      relations: relation,
      withDeleted,
    });
  }

  public async getAll(options?: {
    entityManager?: EntityManager;
    relation?: FindOptionsRelations<ModelType>;
    criterial?: FindOptionsWhere<ModelType>;
  }): Promise<ModelType[]> {
    const repo =
      (options?.entityManager?.getRepository(
        this.model,
      ) as Repository<ModelType>) ?? this.repo;

    return await repo.find({
      where: options?.criterial,
      relations: options?.relation,
      transaction: true,
    });
  }

  public async has(params: {
    criterial: FindOptionsWhere<ModelType>;
    entityManager?: EntityManager;
    relation?: FindOptionsRelations<ModelType>;
  }): Promise<boolean> {
    const { criterial, entityManager, relation } = params;
    const repo =
      (entityManager?.getRepository(this.model) as Repository<ModelType>) ??
      this.repo;

    const count = await repo.count({
      where: criterial,
      relations: relation,
    });

    return count > 0;
  }

  public abstract create(params: {
    creationData: CreationDataType;
    entityManager?: EntityManager;
  }): Promise<ModelType>;

  public async delete(params: {
    criterial: FindOptionsWhere<ModelType>;
    entityManager?: EntityManager;
    relation?: FindOptionsRelations<ModelType>;
  }): Promise<ModelType | null> {
    const { criterial, entityManager, relation } = params;
    const repo =
      (entityManager?.getRepository(this.model) as Repository<ModelType>) ??
      this.repo;

    const existingData = await repo.findOne({
      where: criterial,
      relations: relation,
    });

    if (!existingData) return null;

    return await repo.softRemove(existingData);
  }
}
