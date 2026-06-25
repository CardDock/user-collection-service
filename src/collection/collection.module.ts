import { Module } from '@nestjs/common';
import { CollectionController } from './infrastructure/http/collection.controller';
import {
  GET_COLLECTION_USE_CASE,
  GetCollectionService,
} from './application/get-collection.use-case';
import { PrismaCollectionRepository } from './infrastructure/persistence/prisma-collection.repository';
import { COLLECTION_REPOSITORY_PORT } from './domain/collection-repository.port';

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
