import { Test, TestingModule } from '@nestjs/testing';
import { CollectionService } from './collection.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrisma = {
  userCollection: {
    findMany: jest.fn(),
    count: jest.fn(),
    findFirst: jest.fn(),
  },
};

describe('CollectionService', () => {
  let service: CollectionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CollectionService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<CollectionService>(CollectionService);
    jest.clearAllMocks();
  });

  describe('findByUser', () => {
    const userId = 'user-1';
    const defaultQuery = {
      page: 1,
      limit: 20,
      sort: 'createdAt',
      order: 'desc' as const,
    };

    it('should return paginated results', async () => {
      const fakeData = [{ id: '1', userId, cardId: 123 }];
      mockPrisma.userCollection.findMany.mockResolvedValue(fakeData);
      mockPrisma.userCollection.count.mockResolvedValue(1);

      const result = await service.findByUser(userId, defaultQuery);

      expect(mockPrisma.userCollection.findMany).toHaveBeenCalledWith({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip: 0,
        take: 20,
      });
      expect(mockPrisma.userCollection.count).toHaveBeenCalledWith({
        where: { userId },
      });
      expect(result).toEqual({
        data: fakeData,
        meta: { page: 1, limit: 20, total: 1, totalPages: 1 },
      });
    });

    it('should apply optional filters', async () => {
      mockPrisma.userCollection.findMany.mockResolvedValue([]);
      mockPrisma.userCollection.count.mockResolvedValue(0);

      await service.findByUser(userId, {
        ...defaultQuery,
        condition: 'MINT',
        rarity: 'ULTRA_RARE',
        edition: 'FIRST_EDITION',
        isFoil: true,
      });

      expect(mockPrisma.userCollection.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            userId,
            condition: 'MINT',
            rarity: 'ULTRA_RARE',
            edition: 'FIRST_EDITION',
            isFoil: true,
          },
        }),
      );
    });

    it('should compute pagination correctly', async () => {
      mockPrisma.userCollection.findMany.mockResolvedValue([]);
      mockPrisma.userCollection.count.mockResolvedValue(55);

      const result = await service.findByUser(userId, {
        ...defaultQuery,
        page: 3,
        limit: 10,
      });

      expect(result.meta).toEqual({
        page: 3,
        limit: 10,
        total: 55,
        totalPages: 6,
      });
      expect(mockPrisma.userCollection.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 20, take: 10 }),
      );
    });

    it('should return totalPages 0 for empty collection', async () => {
      mockPrisma.userCollection.findMany.mockResolvedValue([]);
      mockPrisma.userCollection.count.mockResolvedValue(0);

      const result = await service.findByUser(userId, defaultQuery);

      expect(result.meta.totalPages).toBe(0);
    });
  });

  describe('findOne', () => {
    it('should return a record when found', async () => {
      const fakeRecord = { id: 'card-1', userId: 'user-1', cardId: 456 };
      mockPrisma.userCollection.findFirst.mockResolvedValue(fakeRecord);

      const result = await service.findOne('user-1', 'card-1');

      expect(mockPrisma.userCollection.findFirst).toHaveBeenCalledWith({
        where: { id: 'card-1', userId: 'user-1' },
      });
      expect(result).toEqual(fakeRecord);
    });

    it('should return null when not found', async () => {
      mockPrisma.userCollection.findFirst.mockResolvedValue(null);

      const result = await service.findOne('user-1', 'nonexistent');

      expect(result).toBeNull();
    });
  });
});
