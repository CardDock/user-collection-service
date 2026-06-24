import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryCollectionDto } from './dto/query-collection.dto';

@Injectable()
export class CollectionService {
  constructor(private readonly prisma: PrismaService) {}

  async findByUser(userId: string, query: QueryCollectionDto) {
    const { page = 1, limit = 20, condition, rarity, edition, isFoil, sort = 'createdAt', order = 'desc' } = query;

    const where: Record<string, unknown> = { userId };

    if (condition) where.condition = condition;
    if (rarity) where.rarity = rarity;
    if (edition) where.edition = edition;
    if (isFoil !== undefined) where.isFoil = isFoil;

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.userCollection.findMany({
        where,
        orderBy: { [sort]: order },
        skip,
        take: limit,
      }),
      this.prisma.userCollection.count({ where }),
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

  async findOne(userId: string, cardId: string) {
    return this.prisma.userCollection.findFirst({
      where: { id: cardId, userId },
    });
  }
}
