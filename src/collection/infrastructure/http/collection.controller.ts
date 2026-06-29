import {
  Controller,
  Get,
  Param,
  Query,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { GET_COLLECTION_USE_CASE } from '../../application/get-collection.use-case';
import type { GetCollectionUseCase } from '../../application/get-collection.use-case';
import { QueryCollectionDto } from './dto/query-collection.dto';
import { CollectionResponseDto } from './dto/collection-response.dto';
import { UserCollectionEntity } from '../../domain/user-collection.entity';

@Controller('api/v1/collections')
export class CollectionController {
  constructor(
    @Inject(GET_COLLECTION_USE_CASE)
    private readonly getCollection: GetCollectionUseCase,
  ) {}

  @Get(':userId/cards')
  async findByUser(
    @Param('userId') userId: string,
    @Query() query: QueryCollectionDto,
  ): Promise<CollectionResponseDto<UserCollectionEntity>> {
    return this.getCollection.findByUser(userId, {
      page: query.page ?? 1,
      limit: query.limit ?? 20,
      condition: query.condition,
      rarity: query.rarity,
      edition: query.edition,
      isFoil: query.isFoil,
      sort: query.sort ?? 'createdAt',
      order: query.order ?? 'desc',
    });
  }

  @Get(':userId/cards/:cardId')
  async findOne(
    @Param('userId') userId: string,
    @Param('cardId') cardId: string,
  ): Promise<{ data: UserCollectionEntity }> {
    const result = await this.getCollection.findOne(userId, cardId);
    if (!result) {
      throw new NotFoundException('Card not found in collection');
    }
    return { data: result };
  }
}
