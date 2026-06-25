import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  CollectionRepositoryPort,
} from '../../../core/ports/outbound/collection-repository.port';
import { UserCollectionEntity } from '../../../core/domain/user-collection.entity';

@Injectable()
export class PrismaCollectionRepository implements CollectionRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(
    where: Record<string, unknown>,
    orderBy: Record<string, string>,
    skip: number,
    take: number,
  ): Promise<UserCollectionEntity[]> {
    const rows = await this.prisma.userCollection.findMany({
      where,
      orderBy,
      skip,
      take,
    });
    return rows.map(
      (r) =>
        new UserCollectionEntity(
          r.id,
          r.userId,
          r.cardId,
          r.condition,
          r.rarity,
          r.edition,
          r.quantity,
          r.isFoil,
          r.language,
          r.notes,
          r.grade,
          r.purchasePrice ? Number(r.purchasePrice) : null,
          r.createdAt,
          r.updatedAt,
        ),
    );
  }

  async count(where: Record<string, unknown>): Promise<number> {
    return this.prisma.userCollection.count({ where });
  }

  async findFirst(
    where: Record<string, unknown>,
  ): Promise<UserCollectionEntity | null> {
    const row = await this.prisma.userCollection.findFirst({ where });
    if (!row) return null;
    return new UserCollectionEntity(
      row.id,
      row.userId,
      row.cardId,
      row.condition,
      row.rarity,
      row.edition,
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
}
