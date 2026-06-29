import type {
  CollectionRepositoryPort,
  CollectionWhereInput,
} from '../domain/collection-repository.port';
import { PaginatedResult } from '../domain/pagination';
import { UserCollectionEntity } from '../domain/user-collection.entity';
import { CardCondition, CardRarity, CardEdition } from '../domain/enums';

export interface CollectionQuery {
  page: number;
  limit: number;
  condition?: CardCondition;
  rarity?: CardRarity;
  edition?: CardEdition;
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

  findOne(userId: string, cardId: string): Promise<UserCollectionEntity | null>;
}

export class GetCollectionService implements GetCollectionUseCase {
  constructor(private readonly repository: CollectionRepositoryPort) {}

  async findByUser(
    userId: string,
    query: CollectionQuery,
  ): Promise<PaginatedResult<UserCollectionEntity>> {
    const {
      page = 1,
      limit = 20,
      condition,
      rarity,
      edition,
      isFoil,
      sort = 'createdAt',
      order = 'desc',
    } = query;

    const where: CollectionWhereInput = { userId };

    if (condition) where.condition = condition;
    if (rarity) where.rarity = rarity;
    if (edition) where.edition = edition;
    if (isFoil !== undefined) where.isFoil = isFoil;

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.repository.findMany(where, { [sort]: order }, skip, limit),
      this.repository.count(where),
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 0,
      },
    };
  }

  async findOne(
    userId: string,
    cardId: string,
  ): Promise<UserCollectionEntity | null> {
    return this.repository.findFirst({ id: cardId, userId });
  }
}
