import {
  GetCollectionUseCase,
  CollectionQuery,
} from '../ports/inbound/get-collection.use-case';
import {
  COLLECTION_REPOSITORY_PORT,
} from '../ports/outbound/collection-repository.port';
import type { CollectionRepositoryPort } from '../ports/outbound/collection-repository.port';
import { PaginatedResult } from '../domain/pagination';
import { UserCollectionEntity } from '../domain/user-collection.entity';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class GetCollectionService implements GetCollectionUseCase {
  constructor(
    @Inject(COLLECTION_REPOSITORY_PORT)
    private readonly repository: CollectionRepositoryPort,
  ) {}

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

    const where: Record<string, unknown> = { userId };

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
