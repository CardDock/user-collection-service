import type {
  CollectionRepositoryPort,
  CollectionWhereInput,
} from '../domain/collection-repository.port';
import { PaginatedResult } from '../domain/pagination';
import { UserCollectionEntity } from '../domain/user-collection.entity';
import { CardCondition, CardRarity } from '../domain/enums';

export interface CollectionQuery {
  page: number;
  limit: number;
  condition?: CardCondition;
  rarity?: CardRarity;
  cardId?: number;
  sort: string;
  order: 'asc' | 'desc';
}

export const GET_COLLECTION_USE_CASE = Symbol('GET_COLLECTION_USE_CASE');

export interface GetCollectionUseCase {
  findByUser(
    userId: string,
    query: CollectionQuery,
  ): Promise<PaginatedResult<UserCollectionEntity>>;

  findOne(id: string): Promise<UserCollectionEntity | null>;
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
      cardId,
      sort = 'createdAt',
      order = 'desc',
    } = query;

    const where: CollectionWhereInput = { userId };

    if (condition) where.condition = condition;
    if (rarity) where.rarity = rarity;
    if (cardId !== undefined) where.cardId = cardId;

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

  async findOne(id: string): Promise<UserCollectionEntity | null> {
    return this.repository.findFirst({ id });
  }
}
