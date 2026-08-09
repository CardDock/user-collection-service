import { UserCollectionEntity } from './user-collection.entity';
import { CardCondition, CardRarity } from './enums';

export const COLLECTION_REPOSITORY_PORT = Symbol('COLLECTION_REPOSITORY_PORT');

export interface CollectionWhereInput {
  userId?: string;
  condition?: CardCondition;
  rarity?: CardRarity;
  cardId?: number;
  setId?: string;
  id?: string;
}

export interface CreateCollectionInput {
  userId: string;
  cardId: number;
  setId: string;
  condition: CardCondition;
  rarity: CardRarity;
  quantity: number;
  language: string;
  notes?: string | null;
}

export interface UpdateCollectionInput {
  condition?: CardCondition;
  rarity?: CardRarity;
  language?: string;
  quantity?: number;
  setId?: string;
  notes?: string | null;
}

export interface UniqueCollectionInput {
  userId: string;
  cardId: number;
  setId: string;
  condition: CardCondition;
  rarity: CardRarity;
  language: string;
}

export interface CollectionStats {
  totalEntries: number;
  uniqueCardIds: number;
  totalQuantity: number;
  byRarity: Record<string, number>;
  byCondition: Record<string, number>;
  lastUpdated: Date;
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

  create(input: CreateCollectionInput): Promise<UserCollectionEntity>;

  update(
    id: string,
    input: UpdateCollectionInput,
  ): Promise<UserCollectionEntity | null>;

  delete(id: string): Promise<UserCollectionEntity | null>;

  findByUnique(
    input: UniqueCollectionInput,
  ): Promise<UserCollectionEntity | null>;

  getStats(userId: string): Promise<CollectionStats>;
}
