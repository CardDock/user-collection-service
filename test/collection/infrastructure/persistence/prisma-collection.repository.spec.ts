import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { PrismaCollectionRepository } from '../../../../src/collection/infrastructure/persistence/prisma-collection.repository';
import { PrismaService } from '../../../../src/prisma/prisma.service';

describe('PrismaCollectionRepository', () => {
  let repository: PrismaCollectionRepository;
  let mockPrisma: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    mockPrisma = createMock<PrismaService>();

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
    const mockFindMany = mockPrisma.userCollection.findMany as jest.Mock;
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
    const mockCount = mockPrisma.userCollection.count as jest.Mock;
    mockCount.mockResolvedValue(42);

    const result = await repository.count({ userId: 'u1' });

    expect(mockCount).toHaveBeenCalledWith({
      where: { userId: 'u1' },
    });
    expect(result).toBe(42);
  });

  it('should return null when findFirst finds nothing', async () => {
    const mockFindFirst = mockPrisma.userCollection.findFirst as jest.Mock;
    mockFindFirst.mockResolvedValue(null);

    const result = await repository.findFirst({
      id: 'nonexistent',
      userId: 'u1',
    });

    expect(result).toBeNull();
  });
});
