import { Test, TestingModule } from '@nestjs/testing';
import { PrismaCollectionRepository } from '../../../../../src/collection/infrastructure/persistence/prisma-collection.repository';
import { PrismaService } from '../../../../../src/prisma/prisma.service';
import {
  CardCondition,
  CardRarity,
  CardEdition,
} from '../../../../../src/collection/domain/enums';

describe('PrismaCollectionRepository', () => {
  let repository: PrismaCollectionRepository;
  let mockPrisma: Record<string, any>;

  function createMockPrisma(): Record<string, any> {
    return {
      userCollection: {
        findMany: jest.fn(),
        count: jest.fn(),
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        aggregate: jest.fn(),
        groupBy: jest.fn(),
      },
      onModuleInit: jest.fn(),
      onModuleDestroy: jest.fn(),
      $connect: jest.fn(),
      $disconnect: jest.fn(),
    };
  }

  beforeEach(async () => {
    mockPrisma = createMockPrisma();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaCollectionRepository,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    repository = module.get<PrismaCollectionRepository>(
      PrismaCollectionRepository,
    );
    jest.clearAllMocks();
  });

  it('should map Prisma rows to domain entities on findMany', async () => {
    const now = new Date();
    const mockFindMany = mockPrisma.userCollection.findMany;
    mockFindMany.mockResolvedValue([
      {
        id: 'c1',
        userId: 'u1',
        cardId: 123,
        condition: 'MINT',
        rarity: 'ULTRA_RARE',
        edition: 'FIRST_EDITION',
        quantity: 2,
        isFoil: true,
        language: 'en',
        notes: null,
        grade: null,
        purchasePrice: null,
        createdAt: now,
        updatedAt: now,
      },
    ]);

    const result = await repository.findMany(
      { userId: 'u1' },
      { createdAt: 'desc' },
      0,
      10,
    );

    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(Object);
    expect(result[0].id).toBe('c1');
    expect(result[0].cardId).toBe(123);
    expect(result[0].purchasePrice).toBeNull();
  });

  it('should call count with the correct where clause', async () => {
    const mockCount = mockPrisma.userCollection.count;
    mockCount.mockResolvedValue(42);

    const result = await repository.count({ userId: 'u1' });

    expect(mockCount).toHaveBeenCalledWith({
      where: { userId: 'u1' },
    });
    expect(result).toBe(42);
  });

  it('should return null when findFirst finds nothing', async () => {
    const mockFindFirst = mockPrisma.userCollection.findFirst;
    mockFindFirst.mockResolvedValue(null);

    const result = await repository.findFirst({
      id: 'nonexistent',
      userId: 'u1',
    });

    expect(result).toBeNull();
  });

  describe('findFirst', () => {
    it('should return an entity when found', async () => {
      const now = new Date();
      mockPrisma.userCollection.findFirst.mockResolvedValue({
        id: 'c1', userId: 'u1', cardId: 123, condition: 'MINT',
        rarity: 'ULTRA_RARE', edition: 'FIRST_EDITION', quantity: 2,
        isFoil: true, language: 'en', notes: null, grade: null,
        purchasePrice: null, createdAt: now, updatedAt: now,
      });

      const result = await repository.findFirst({ id: 'c1' });

      expect(result).not.toBeNull();
      expect(result!.id).toBe('c1');
    });
  });

  describe('create', () => {
    it('should create and return a mapped entity', async () => {
      const now = new Date();
      mockPrisma.userCollection.create.mockResolvedValue({
        id: 'new-1', userId: 'u1', cardId: 999, condition: 'MINT',
        rarity: 'RARE', edition: 'UNLIMITED', quantity: 1,
        isFoil: false, language: 'en', notes: 'test note', grade: '9',
        purchasePrice: 25.5, createdAt: now, updatedAt: now,
      });

      const result = await repository.create({
        userId: 'u1', cardId: 999, condition: CardCondition.MINT,
        rarity: CardRarity.RARE, edition: CardEdition.UNLIMITED,
        quantity: 1, isFoil: false, language: 'en',
        notes: 'test note', grade: '9', purchasePrice: 25.5,
      });

      expect(mockPrisma.userCollection.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: 'u1', cardId: 999, quantity: 1, purchasePrice: 25.5,
        }),
      });
      expect(result).toBeInstanceOf(Object);
      expect(result.id).toBe('new-1');
    });

    it('should map purchasePrice as number when present', async () => {
      const now = new Date();
      mockPrisma.userCollection.create.mockResolvedValue({
        id: 'c1', userId: 'u1', cardId: 1, condition: 'MINT',
        rarity: 'COMMON', edition: 'UNLIMITED', quantity: 1,
        isFoil: false, language: 'en', notes: null, grade: null,
        purchasePrice: 15.99, createdAt: now, updatedAt: now,
      });

      const result = await repository.create({
        userId: 'u1', cardId: 1, condition: CardCondition.MINT,
        rarity: CardRarity.COMMON, edition: CardEdition.UNLIMITED,
        quantity: 1, isFoil: false, language: 'en',
        purchasePrice: 15.99,
      });

      expect(result.purchasePrice).toBe(15.99);
    });
  });

  describe('update', () => {
    it('should update and return entity when found', async () => {
      const now = new Date();
      mockPrisma.userCollection.findUnique.mockResolvedValue({
        id: 'c1', userId: 'u1', cardId: 1, condition: 'MINT',
        rarity: 'COMMON', edition: 'UNLIMITED', quantity: 1,
        isFoil: false, language: 'en', notes: null, grade: null,
        purchasePrice: null, createdAt: now, updatedAt: now,
      });
      mockPrisma.userCollection.update.mockResolvedValue({
        id: 'c1', userId: 'u1', cardId: 1, condition: 'MINT',
        rarity: 'COMMON', edition: 'UNLIMITED', quantity: 5,
        isFoil: false, language: 'en', notes: 'updated', grade: null,
        purchasePrice: null, createdAt: now, updatedAt: now,
      });

      const result = await repository.update('c1', { quantity: 5, notes: 'updated' });

      expect(mockPrisma.userCollection.findUnique).toHaveBeenCalledWith({ where: { id: 'c1' } });
      expect(mockPrisma.userCollection.update).toHaveBeenCalledWith({
        where: { id: 'c1' },
        data: { quantity: 5, notes: 'updated' },
      });
      expect(result).not.toBeNull();
      expect(result!.quantity).toBe(5);
    });

    it('should return null when entry does not exist', async () => {
      mockPrisma.userCollection.findUnique.mockResolvedValue(null);

      const result = await repository.update('nonexistent', { quantity: 5 });

      expect(result).toBeNull();
      expect(mockPrisma.userCollection.update).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete and return the deleted entity when found', async () => {
      const now = new Date();
      const existingRow = {
        id: 'c1', userId: 'u1', cardId: 1, condition: 'MINT',
        rarity: 'COMMON', edition: 'UNLIMITED', quantity: 1,
        isFoil: false, language: 'en', notes: null, grade: null,
        purchasePrice: null, createdAt: now, updatedAt: now,
      };
      mockPrisma.userCollection.findUnique.mockResolvedValue(existingRow);
      mockPrisma.userCollection.delete.mockResolvedValue(existingRow);

      const result = await repository.delete('c1');

      expect(mockPrisma.userCollection.findUnique).toHaveBeenCalledWith({ where: { id: 'c1' } });
      expect(mockPrisma.userCollection.delete).toHaveBeenCalledWith({ where: { id: 'c1' } });
      expect(result).not.toBeNull();
      expect(result!.id).toBe('c1');
    });

    it('should return null when entry does not exist', async () => {
      mockPrisma.userCollection.findUnique.mockResolvedValue(null);

      const result = await repository.delete('nonexistent');

      expect(result).toBeNull();
      expect(mockPrisma.userCollection.delete).not.toHaveBeenCalled();
    });
  });

  describe('findByUnique', () => {
    it('should return entity when found', async () => {
      const now = new Date();
      mockPrisma.userCollection.findFirst.mockResolvedValue({
        id: 'c1', userId: 'u1', cardId: 123, condition: 'MINT',
        rarity: 'ULTRA_RARE', edition: 'FIRST_EDITION', quantity: 2,
        isFoil: true, language: 'en', notes: null, grade: null,
        purchasePrice: null, createdAt: now, updatedAt: now,
      });

      const result = await repository.findByUnique({
        userId: 'u1', cardId: 123, condition: CardCondition.MINT,
        rarity: CardRarity.ULTRA_RARE, edition: CardEdition.FIRST_EDITION,
        isFoil: true, language: 'en',
      });

      expect(mockPrisma.userCollection.findFirst).toHaveBeenCalledWith({
        where: {
          userId: 'u1', cardId: 123, condition: CardCondition.MINT,
          rarity: CardRarity.ULTRA_RARE, edition: CardEdition.FIRST_EDITION,
          isFoil: true, language: 'en',
        },
      });
      expect(result).not.toBeNull();
      expect(result!.id).toBe('c1');
    });

    it('should return null when not found', async () => {
      mockPrisma.userCollection.findFirst.mockResolvedValue(null);

      const result = await repository.findByUnique({
        userId: 'u1', cardId: 999, condition: CardCondition.MINT,
        rarity: CardRarity.ULTRA_RARE, edition: CardEdition.FIRST_EDITION,
        isFoil: true, language: 'en',
      });

      expect(result).toBeNull();
    });
  });

  describe('getStats', () => {
    it('should return computed statistics for a user', async () => {
      const now = new Date();
      mockPrisma.userCollection.count.mockResolvedValue(5);
      mockPrisma.userCollection.findMany.mockResolvedValue([
        { cardId: 1 }, { cardId: 2 }, { cardId: 3 },
      ]);
      mockPrisma.userCollection.aggregate
        .mockResolvedValueOnce({ _sum: { quantity: 15 } })
        .mockResolvedValueOnce({ _max: { updatedAt: now } });
      mockPrisma.userCollection.groupBy
        .mockResolvedValueOnce([
          { rarity: 'ULTRA_RARE', _count: 3 },
          { rarity: 'COMMON', _count: 2 },
        ])
        .mockResolvedValueOnce([
          { condition: 'MINT', _count: 4 },
          { condition: 'PLAYED', _count: 1 },
        ])
        .mockResolvedValueOnce([
          { edition: 'FIRST_EDITION', _count: 3 },
          { edition: 'UNLIMITED', _count: 2 },
        ]);

      const stats = await repository.getStats('u1');

      expect(stats.totalEntries).toBe(5);
      expect(stats.uniqueCardIds).toBe(3);
      expect(stats.totalQuantity).toBe(15);
      expect(stats.byRarity).toEqual({ ULTRA_RARE: 3, COMMON: 2 });
      expect(stats.byCondition).toEqual({ MINT: 4, PLAYED: 1 });
      expect(stats.byEdition).toEqual({ FIRST_EDITION: 3, UNLIMITED: 2 });
      expect(stats.lastUpdated).toEqual(now);
    });

    it('should handle empty stats with defaults', async () => {
      const now = new Date();
      mockPrisma.userCollection.count.mockResolvedValue(0);
      mockPrisma.userCollection.findMany.mockResolvedValue([]);
      mockPrisma.userCollection.aggregate
        .mockResolvedValueOnce({ _sum: { quantity: null } })
        .mockResolvedValueOnce({ _max: { updatedAt: null } });
      mockPrisma.userCollection.groupBy
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);

      const stats = await repository.getStats('u1');

      expect(stats.totalEntries).toBe(0);
      expect(stats.uniqueCardIds).toBe(0);
      expect(stats.totalQuantity).toBe(0);
      expect(stats.byRarity).toEqual({});
      expect(stats.byCondition).toEqual({});
      expect(stats.byEdition).toEqual({});
      expect(stats.lastUpdated).toBeInstanceOf(Date);
    });
  });
});
