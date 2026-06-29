import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  CollectionRepositoryPort,
  CollectionWhereInput,
  CollectionOrderBy,
} from '../../domain/collection-repository.port';
import { UserCollectionEntity } from '../../domain/user-collection.entity';
import { CardCondition, CardRarity, CardEdition } from '../../domain/enums';

@Injectable()
export class PrismaCollectionRepository implements CollectionRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(
    where: CollectionWhereInput,
    orderBy: CollectionOrderBy,
    skip: number,
    take: number,
  ): Promise<UserCollectionEntity[]> {
    const rows = (await this.prisma.userCollection.findMany({
      where: where as unknown as Record<string, unknown>,
      orderBy: orderBy,
      skip,
      take,
    })) as unknown as PrismaUserCollectionRow[];

    return rows.map(toEntity);
  }

  async count(where: CollectionWhereInput): Promise<number> {
    return this.prisma.userCollection.count({
      where: where as unknown as Record<string, unknown>,
    });
  }

  async findFirst(
    where: CollectionWhereInput,
  ): Promise<UserCollectionEntity | null> {
    const row = (await this.prisma.userCollection.findFirst({
      where: where as unknown as Record<string, unknown>,
    })) as unknown as PrismaUserCollectionRow | null;

    if (!row) return null;
    return toEntity(row);
  }
}

interface PrismaUserCollectionRow {
  id: string;
  userId: string;
  cardId: number;
  condition: string;
  rarity: string;
  edition: string;
  quantity: number;
  isFoil: boolean;
  language: string;
  notes: string | null;
  grade: string | null;
  purchasePrice: unknown;
  createdAt: Date;
  updatedAt: Date;
}

function toEntity(row: PrismaUserCollectionRow): UserCollectionEntity {
  return new UserCollectionEntity(
    row.id,
    row.userId,
    row.cardId,
    row.condition as CardCondition,
    row.rarity as CardRarity,
    row.edition as CardEdition,
    row.quantity,
    row.isFoil,
    row.language,
    row.notes,
    row.grade,
    row.purchasePrice ? Number(row.purchasePrice) : null,
    row.createdAt,
    row.updatedAt,
  );
}
