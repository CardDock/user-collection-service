import { Test, TestingModule } from '@nestjs/testing';
import { PrismaCollectionRepository } from './prisma-collection.repository';
import { PrismaService } from '../../../prisma/prisma.service';

const mockPrisma = {
  userCollection: {
    findMany: jest.fn(),
    count: jest.fn(),
    findFirst: jest.fn(),
  },
};

describe('PrismaCollectionRepository', () => {
  let repository: PrismaCollectionRepository;

  beforeEach(async () => {
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
    mockPrisma.userCollection.findMany.mockResolvedValue([
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
    mockPrisma.userCollection.count.mockResolvedValue(42);

    const result = await repository.count({ userId: 'u1' });

    expect(mockPrisma.userCollection.count).toHaveBeenCalledWith({
      where: { userId: 'u1' },
    });
    expect(result).toBe(42);
  });

  it('should return null when findFirst finds nothing', async () => {
    mockPrisma.userCollection.findFirst.mockResolvedValue(null);

    const result = await repository.findFirst({
      id: 'nonexistent',
      userId: 'u1',
    });

    expect(result).toBeNull();
  });
});
