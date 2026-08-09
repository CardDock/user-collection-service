import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { GET_COLLECTION_USE_CASE } from '../../application/get-collection.use-case';
import { MANAGE_COLLECTION_USE_CASE } from '../../application/manage-collection.use-case';
import type { GetCollectionUseCase } from '../../application/get-collection.use-case';
import type { ManageCollectionUseCase } from '../../application/manage-collection.use-case';
import { QueryCollectionDto } from './dto/query-collection.dto';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { CollectionResponseDto } from './dto/collection-response.dto';
import { UserCollectionEntity } from '../../domain/user-collection.entity';
import type { CollectionStats } from '../../domain/collection-repository.port';

@Controller('api/v1/collections')
export class CollectionController {
  constructor(
    @Inject(GET_COLLECTION_USE_CASE)
    private readonly getCollection: GetCollectionUseCase,
    @Inject(MANAGE_COLLECTION_USE_CASE)
    private readonly manageCollection: ManageCollectionUseCase,
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
      cardId: query.cardId,
      sort: query.sort ?? 'createdAt',
      order: query.order ?? 'desc',
    });
  }

  @Get('cards/:id')
  async findOne(
    @Param('id') id: string,
  ): Promise<{ data: UserCollectionEntity }> {
    const result = await this.getCollection.findOne(id);
    if (!result) {
      throw new NotFoundException('Collection entry not found');
    }
    return { data: result };
  }

  @Post(':userId/cards')
  async addCard(
    @Param('userId') userId: string,
    @Body() dto: CreateCollectionDto,
  ): Promise<{ data: UserCollectionEntity }> {
    const result = await this.manageCollection.addCard(userId, dto);
    return { data: result };
  }

  @Put(':userId/cards/:id')
  async updateCard(
    @Param('userId') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateCollectionDto,
  ): Promise<{ data: UserCollectionEntity }> {
    const result = await this.manageCollection.updateCard(userId, id, dto);
    return { data: result };
  }

  @Delete(':userId/cards/:id')
  async removeCard(
    @Param('userId') userId: string,
    @Param('id') id: string,
  ): Promise<void> {
    await this.manageCollection.removeCard(userId, id);
  }

  @Get(':userId/stats')
  async getStats(
    @Param('userId') userId: string,
  ): Promise<{ data: CollectionStats }> {
    const result = await this.manageCollection.getStats(userId);
    return { data: result };
  }
}
