import { UserCollectionEntity } from './user-collection.entity';
import { CardCondition, CardRarity, CardEdition } from './enums';

export const COLLECTION_REPOSITORY_PORT = Symbol('COLLECTION_REPOSITORY_PORT');

export interface CollectionWhereInput {
  userId: string;
  condition?: CardCondition;
  rarity?: CardRarity;
  edition?: CardEdition;
  isFoil?: boolean;
  cardId?: number;
  id?: string;
}

export type SortOrder = 'asc' | 'desc';
export type CollectionOrderBy = Record<string, SortOrder>;

export interface CollectionRepositoryPort {
  findMany(
    where: CollectionWhereInput,
    orderBy: CollectionOrderBy,
    skip: number,
    take: number,
  ): Promise<UserCollectionEntity[]>;

  count(where: CollectionWhereInput): Promise<number>;

  findFirst(where: CollectionWhereInput): Promise<UserCollectionEntity | null>;
}
