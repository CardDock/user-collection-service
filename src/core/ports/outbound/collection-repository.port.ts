import { UserCollectionEntity } from '../../domain/user-collection.entity';

export const COLLECTION_REPOSITORY_PORT = Symbol('COLLECTION_REPOSITORY_PORT');

export interface CollectionRepositoryPort {
  findMany(
    where: Record<string, unknown>,
    orderBy: Record<string, string>,
    skip: number,
    take: number,
  ): Promise<UserCollectionEntity[]>;

  count(where: Record<string, unknown>): Promise<number>;

  findFirst(
    where: Record<string, unknown>,
  ): Promise<UserCollectionEntity | null>;
}
