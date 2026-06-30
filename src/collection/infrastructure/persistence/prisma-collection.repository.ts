import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  CollectionRepositoryPort,
  CollectionWhereInput,
  CollectionOrderBy,
  CreateCollectionInput,
  UpdateCollectionInput,
  UniqueCollectionInput,
  CollectionStats,
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

  async create(input: CreateCollectionInput): Promise<UserCollectionEntity> {
    const row = await this.prisma.userCollection.create({
      data: {
        userId: input.userId,
        cardId: input.cardId,
        condition: input.condition,
        rarity: input.rarity,
        edition: input.edition,
        quantity: input.quantity,
        isFoil: input.isFoil,
        language: input.language,
        notes: input.notes ?? null,
        grade: input.grade ?? null,
        purchasePrice: input.purchasePrice ?? null,
      },
    });

    return toEntity(row);
  }

  async update(
    id: string,
    input: UpdateCollectionInput,
  ): Promise<UserCollectionEntity | null> {
    const existing = await this.prisma.userCollection.findUnique({
      where: { id },
    });

    if (!existing) return null;

    const row = await this.prisma.userCollection.update({
      where: { id },
      data: {
        ...(input.quantity !== undefined && { quantity: input.quantity }),
        ...(input.notes !== undefined && { notes: input.notes }),
        ...(input.grade !== undefined && { grade: input.grade }),
        ...(input.purchasePrice !== undefined && {
          purchasePrice: input.purchasePrice,
        }),
      },
    });

    return toEntity(row);
  }

  async delete(id: string): Promise<UserCollectionEntity | null> {
    const existing = await this.prisma.userCollection.findUnique({
      where: { id },
    });

    if (!existing) return null;

    await this.prisma.userCollection.delete({ where: { id } });

    return toEntity(existing);
  }

  async findByUnique(
    input: UniqueCollectionInput,
  ): Promise<UserCollectionEntity | null> {
    const row = await this.prisma.userCollection.findFirst({
      where: {
        userId: input.userId,
        cardId: input.cardId,
        condition: input.condition,
        rarity: input.rarity,
        edition: input.edition,
        isFoil: input.isFoil,
        language: input.language,
      },
    });

    if (!row) return null;
    return toEntity(row);
  }

  async getStats(userId: string): Promise<CollectionStats> {
    const [
      totalEntries,
      uniqueCardRows,
      quantityAgg,
      byRarity,
      byCondition,
      byEdition,
      lastUpdatedAgg,
    ] = await Promise.all([
      this.prisma.userCollection.count({ where: { userId } }),
      this.prisma.userCollection.findMany({
        where: { userId },
        select: { cardId: true },
        distinct: ['cardId'],
      }),
      this.prisma.userCollection.aggregate({
        where: { userId },
        _sum: { quantity: true },
      }),
      this.prisma.userCollection.groupBy({
        by: ['rarity'],
        where: { userId },
        _count: true,
      }),
      this.prisma.userCollection.groupBy({
        by: ['condition'],
        where: { userId },
        _count: true,
      }),
      this.prisma.userCollection.groupBy({
        by: ['edition'],
        where: { userId },
        _count: true,
      }),
      this.prisma.userCollection.aggregate({
        where: { userId },
        _max: { updatedAt: true },
      }),
    ]);

    return {
      totalEntries,
      uniqueCardIds: uniqueCardRows.length,
      totalQuantity: quantityAgg._sum.quantity ?? 0,
      byRarity: Object.fromEntries(byRarity.map((r) => [r.rarity, r._count])),
      byCondition: Object.fromEntries(
        byCondition.map((c) => [c.condition, c._count]),
      ),
      byEdition: Object.fromEntries(
        byEdition.map((e) => [e.edition, e._count]),
      ),
      lastUpdated: lastUpdatedAgg._max.updatedAt ?? new Date(),
    };
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
