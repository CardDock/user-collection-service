import { createMock } from '@golevelup/ts-jest';
import {
  GetCollectionService,
  CollectionQuery,
  GetCollectionUseCase,
} from '../../../src/collection/application/get-collection.use-case';
import { CollectionRepositoryPort } from '../../../src/collection/domain/collection-repository.port';
import { UserCollectionEntity } from '../../../src/collection/domain/user-collection.entity';
import {
  CardCondition,
  CardRarity,
  CardEdition,
} from '../../../src/collection/domain/enums';

describe('GetCollectionService', () => {
  let service: GetCollectionUseCase;
  let mockRepo: jest.Mocked<CollectionRepositoryPort>;

  beforeEach(() => {
    mockRepo = createMock<CollectionRepositoryPort>();
    service = new GetCollectionService(mockRepo);
    jest.clearAllMocks();
  });

  describe('findByUser', () => {
    const userId = 'user-1';
    const defaultQuery: CollectionQuery = {
      page: 1,
      limit: 20,
      sort: 'createdAt',
      order: 'desc',
    };

    it('should return paginated results', async () => {
      const fakeData = [
        new UserCollectionEntity(
          '1',
          userId,
          123,
          CardCondition.MINT,
          CardRarity.ULTRA_RARE,
          CardEdition.FIRST_EDITION,
          2,
          true,
          'en',
          null,
          null,
          null,
          new Date(),
          new Date(),
        ),
      ];
      mockRepo.findMany.mockResolvedValue(fakeData);
      mockRepo.count.mockResolvedValue(1);

      const result = await service.findByUser(userId, defaultQuery);

      expect(mockRepo.findMany).toHaveBeenCalledWith(
        { userId },
        { createdAt: 'desc' },
        0,
        20,
      );
      expect(mockRepo.count).toHaveBeenCalledWith({ userId });
      expect(result).toEqual({
        data: fakeData,
        meta: { page: 1, limit: 20, total: 1, totalPages: 1 },
      });
    });

    it('should apply optional filters', async () => {
      mockRepo.findMany.mockResolvedValue([]);
      mockRepo.count.mockResolvedValue(0);

      await service.findByUser(userId, {
        ...defaultQuery,
        condition: CardCondition.MINT,
        rarity: CardRarity.ULTRA_RARE,
        edition: CardEdition.FIRST_EDITION,
        isFoil: true,
      });

      expect(mockRepo.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          userId,
          condition: CardCondition.MINT,
          rarity: CardRarity.ULTRA_RARE,
          edition: CardEdition.FIRST_EDITION,
          isFoil: true,
        }),
        expect.any(Object),
        expect.any(Number),
        expect.any(Number),
      );
    });

    it('should compute pagination correctly', async () => {
      mockRepo.findMany.mockResolvedValue([]);
      mockRepo.count.mockResolvedValue(55);

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
      expect(mockRepo.findMany).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Object),
        20,
        10,
      );
    });

    it('should return totalPages 0 for empty collection', async () => {
      mockRepo.findMany.mockResolvedValue([]);
      mockRepo.count.mockResolvedValue(0);

      const result = await service.findByUser(userId, defaultQuery);

      expect(result.meta.totalPages).toBe(0);
    });
  });

  describe('findOne', () => {
    it('should return a record when found', async () => {
      const fakeRecord = new UserCollectionEntity(
        'card-1',
        'user-1',
        456,
        CardCondition.MINT,
        CardRarity.ULTRA_RARE,
        CardEdition.FIRST_EDITION,
        1,
        false,
        'en',
        null,
        null,
        null,
        new Date(),
        new Date(),
      );
      mockRepo.findFirst.mockResolvedValue(fakeRecord);

      const result = await service.findOne('card-1');

      expect(mockRepo.findFirst).toHaveBeenCalledWith({
        id: 'card-1',
      });
      expect(result).toEqual(fakeRecord);
    });

    it('should return null when not found', async () => {
      mockRepo.findFirst.mockResolvedValue(null);

      const result = await service.findOne('nonexistent');

      expect(result).toBeNull();
    });
  });
});
