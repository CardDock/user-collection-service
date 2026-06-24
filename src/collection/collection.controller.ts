import { Controller, Get, Param, Query, NotFoundException } from '@nestjs/common';
import { CollectionService } from './collection.service';
import { QueryCollectionDto } from './dto/query-collection.dto';

@Controller('api/v1/collections')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @Get(':userId/cards')
  async findByUser(
    @Param('userId') userId: string,
    @Query() query: QueryCollectionDto,
  ) {
    return this.collectionService.findByUser(userId, query);
  }

  @Get(':userId/cards/:cardId')
  async findOne(
    @Param('userId') userId: string,
    @Param('cardId') cardId: string,
  ) {
    const result = await this.collectionService.findOne(userId, cardId);
    if (!result) {
      throw new NotFoundException('Card not found in collection');
    }
    return { data: result };
  }
}
