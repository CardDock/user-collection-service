import { createMock } from '@golevelup/ts-jest';
import { NotFoundException } from '@nestjs/common';
import {
  ManageCollectionService,
  ManageCollectionUseCase,
} from '../../../../src/collection/application/manage-collection.use-case';
import { CollectionRepositoryPort } from '../../../../src/collection/domain/collection-repository.port';
import { UserCollectionEntity } from '../../../../src/collection/domain/user-collection.entity';
import {
  CardCondition,
  CardRarity,
} from '../../../../src/collection/domain/enums';

describe('ManageCollectionService', () => {
  let service: ManageCollectionUseCase;
  let mockRepo: jest.Mocked<CollectionRepositoryPort>;

  const baseEntity = new UserCollectionEntity(
    'c1', 'user-1', 123, 'LOB', CardCondition.MINT, CardRarity.ULTRA_RARE,
    2, 'en', null, new Date(), new Date(),
  );

  beforeEach(() => {
    mockRepo = createMock<CollectionRepositoryPort>();
    service = new ManageCollectionService(mockRepo);
    jest.clearAllMocks();
  });

  describe('addCard', () => {
    const createDto = {
      cardId: 123,
      setId: 'LOB',
      condition: CardCondition.MINT,
      rarity: CardRarity.ULTRA_RARE,
      language: 'en',
      quantity: 2,
    };

    it('should create a new entry with mapped fields', async () => {
      mockRepo.create.mockResolvedValue(baseEntity);

      const result = await service.addCard('user-1', createDto as any);

      expect(mockRepo.create).toHaveBeenCalledWith({
        userId: 'user-1',
        cardId: 123,
        setId: 'LOB',
        condition: CardCondition.MINT,
        rarity: CardRarity.ULTRA_RARE,
        language: 'en',
        quantity: 2,
        notes: null,
      });
      expect(result).toEqual(baseEntity);
    });

    it('should default quantity to 1 when not provided', async () => {
      mockRepo.create.mockResolvedValue(baseEntity);

      await service.addCard('user-1', { ...createDto, quantity: undefined } as any);

      expect(mockRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ quantity: 1 }),
      );
    });

    it('should default notes to null when not provided', async () => {
      mockRepo.create.mockResolvedValue(baseEntity);

      const dto = {
        cardId: 123,
        setId: 'LOB',
        condition: CardCondition.MINT,
        rarity: CardRarity.ULTRA_RARE,
        language: 'en',
      };

      await service.addCard('user-1', dto as any);

      expect(mockRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          notes: null,
        }),
      );
    });
  });

  describe('updateCard', () => {
    it('should update card fields when entry belongs to user', async () => {
      const updated = new UserCollectionEntity(
        'c1', 'user-1', 123, 'LOB', CardCondition.MINT, CardRarity.ULTRA_RARE,
        5, 'en', 'new notes', new Date(), new Date(),
      );
      mockRepo.findFirst.mockResolvedValue(baseEntity);
      mockRepo.update.mockResolvedValue(updated);

      const result = await service.updateCard('user-1', 'c1', {
        quantity: 5,
        notes: 'new notes',
      } as any);

      expect(mockRepo.findFirst).toHaveBeenCalledWith({ id: 'c1', userId: 'user-1' });
      expect(mockRepo.update).toHaveBeenCalledWith('c1', {
        quantity: 5,
        notes: 'new notes',
      });
      expect(result).toEqual(updated);
    });

    it('should only include defined fields in update input', async () => {
      mockRepo.findFirst.mockResolvedValue(baseEntity);
      mockRepo.update.mockResolvedValue(baseEntity);

      await service.updateCard('user-1', 'c1', { quantity: 3 } as any);

      expect(mockRepo.update).toHaveBeenCalledWith('c1', {
        quantity: 3,
      });
    });

    it('should throw NotFoundException when entry not found', async () => {
      mockRepo.findFirst.mockResolvedValue(null);

      await expect(
        service.updateCard('user-1', 'nonexistent', { quantity: 3 } as any),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when entry belongs to different user', async () => {
      mockRepo.findFirst.mockResolvedValue(null);

      await expect(
        service.updateCard('other-user', 'c1', { quantity: 3 } as any),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeCard', () => {
    it('should delete and return nothing when entry exists and belongs to user', async () => {
      mockRepo.findFirst.mockResolvedValue(baseEntity);
      mockRepo.delete.mockResolvedValue(baseEntity);

      await service.removeCard('user-1', 'c1');

      expect(mockRepo.findFirst).toHaveBeenCalledWith({ id: 'c1', userId: 'user-1' });
      expect(mockRepo.delete).toHaveBeenCalledWith('c1');
    });

    it('should throw NotFoundException when entry not found', async () => {
      mockRepo.findFirst.mockResolvedValue(null);

      await expect(service.removeCard('user-1', 'nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException when entry belongs to different user', async () => {
      mockRepo.findFirst.mockResolvedValue(null);

      await expect(service.removeCard('other-user', 'c1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getStats', () => {
    it('should return stats from repository', async () => {
      const stats = {
        totalEntries: 10,
        uniqueCardIds: 5,
        totalQuantity: 25,
        byRarity: { ULTRA_RARE: 3, COMMON: 2 },
        byCondition: { MINT: 4, PLAYED: 1 },
        lastUpdated: new Date(),
      };
      mockRepo.getStats.mockResolvedValue(stats);

      const result = await service.getStats('user-1');

      expect(mockRepo.getStats).toHaveBeenCalledWith('user-1');
      expect(result).toEqual(stats);
    });
  });
});
