import { PaginatedResult } from '../../domain/pagination';
import { UserCollectionEntity } from '../../domain/user-collection.entity';

export interface CollectionQuery {
  page: number;
  limit: number;
  condition?: string;
  rarity?: string;
  edition?: string;
  isFoil?: boolean;
  sort: string;
  order: 'asc' | 'desc';
}

export const GET_COLLECTION_USE_CASE = Symbol('GET_COLLECTION_USE_CASE');

export interface GetCollectionUseCase {
  findByUser(
    userId: string,
    query: CollectionQuery,
  ): Promise<PaginatedResult<UserCollectionEntity>>;

  findOne(
    userId: string,
    cardId: string,
  ): Promise<UserCollectionEntity | null>;
}
