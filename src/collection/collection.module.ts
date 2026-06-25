import { Module } from '@nestjs/common';
import { CollectionController } from '../adapters/inbound/http/collection.controller';
import { GetCollectionService } from '../core/services/get-collection.service';
import { PrismaCollectionRepository } from '../adapters/outbound/prisma/prisma-collection.repository';
import {
  GET_COLLECTION_USE_CASE,
} from '../core/ports/inbound/get-collection.use-case';
import {
  COLLECTION_REPOSITORY_PORT,
} from '../core/ports/outbound/collection-repository.port';

@Module({
  controllers: [CollectionController],
  providers: [
    {
      provide: GET_COLLECTION_USE_CASE,
      useClass: GetCollectionService,
    },
    {
      provide: COLLECTION_REPOSITORY_PORT,
      useClass: PrismaCollectionRepository,
    },
  ],
})
export class CollectionModule {}
