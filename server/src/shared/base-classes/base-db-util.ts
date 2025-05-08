import { ModelContructorType } from 'src/database/entity-model';
import {
  EntityManager,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

type Model<T extends ModelContructorType> = InstanceType<T>;

export abstract class BaseDBUtil<
  T extends ModelContructorType,
  CreationDataType extends object,
> {
  constructor(
    private readonly model: T,
    protected readonly repo: Repository<Model<T>>,
  ) {}

  public async getOne(params: {
    criterial: FindOptionsWhere<Model<T>>;
    entityManager?: EntityManager;
    relation?: FindOptionsRelations<Model<T>>;
    withDeleted?: boolean;
  }): Promise<Model<T> | null> {
    const { criterial, entityManager, relation, withDeleted } = params;
    const repo =
      (entityManager?.getRepository(this.model) as Repository<Model<T>>) ??
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
    relation?: FindOptionsRelations<Model<T>>;
    criterial?: FindOptionsWhere<Model<T>>;
  }): Promise<Model<T>[]> {
    const repo =
      (options?.entityManager?.getRepository(this.model) as Repository<
        Model<T>
      >) ?? this.repo;

    return await repo.find({
      where: options?.criterial,
      relations: options?.relation,
      transaction: true,
    });
  }

  public async has(params: {
    criterial: FindOptionsWhere<Model<T>>;
    entityManager?: EntityManager;
    relation?: FindOptionsRelations<Model<T>>;
  }): Promise<boolean> {
    const { criterial, entityManager, relation } = params;
    const repo =
      (entityManager?.getRepository(this.model) as Repository<Model<T>>) ??
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
  }): Promise<Model<T>>;

  public async delete(params: {
    criterial: FindOptionsWhere<Model<T>>;
    entityManager?: EntityManager;
    relation?: FindOptionsRelations<Model<T>>;
  }): Promise<Model<T> | null> {
    const { criterial, entityManager, relation } = params;
    const repo =
      (entityManager?.getRepository(this.model) as Repository<Model<T>>) ??
      this.repo;

    const existingData = await repo.findOne({
      where: criterial,
      relations: relation,
    });

    if (!existingData) return null;

    return await repo.softRemove(existingData);
  }
}
