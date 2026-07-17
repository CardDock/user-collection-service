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
  CardEdition,
} from '../../../../src/collection/domain/enums';

describe('ManageCollectionService', () => {
  let service: ManageCollectionUseCase;
  let mockRepo: jest.Mocked<CollectionRepositoryPort>;

  const baseEntity = new UserCollectionEntity(
    'c1', 'user-1', 123, CardCondition.MINT, CardRarity.ULTRA_RARE,
    CardEdition.FIRST_EDITION, 2, true, 'en', null, null, null,
    new Date(), new Date(),
  );

  beforeEach(() => {
    mockRepo = createMock<CollectionRepositoryPort>();
    service = new ManageCollectionService(mockRepo);
    jest.clearAllMocks();
  });

  describe('addCard', () => {
    const createDto = {
      cardId: 123,
      condition: CardCondition.MINT,
      rarity: CardRarity.ULTRA_RARE,
      edition: CardEdition.FIRST_EDITION,
      isFoil: true,
      language: 'en',
      quantity: 2,
    };

    it('should create a new entry when no existing card found', async () => {
      mockRepo.findByUnique.mockResolvedValue(null);
      mockRepo.create.mockResolvedValue(baseEntity);

      const result = await service.addCard('user-1', createDto as any);

      expect(mockRepo.findByUnique).toHaveBeenCalledWith({
        userId: 'user-1',
        cardId: 123,
        condition: CardCondition.MINT,
        rarity: CardRarity.ULTRA_RARE,
        edition: CardEdition.FIRST_EDITION,
        isFoil: true,
        language: 'en',
      });
      expect(mockRepo.create).toHaveBeenCalledWith(expect.objectContaining({
        userId: 'user-1',
        cardId: 123,
        quantity: 2,
      }));
      expect(result).toEqual(baseEntity);
    });

    it('should default quantity to 1 when not provided', async () => {
      mockRepo.findByUnique.mockResolvedValue(null);
      mockRepo.create.mockResolvedValue(baseEntity);

      await service.addCard('user-1', { ...createDto, quantity: undefined } as any);

      expect(mockRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ quantity: 1 }),
      );
    });

    it('should default nullable fields to null when not provided', async () => {
      mockRepo.findByUnique.mockResolvedValue(null);
      mockRepo.create.mockResolvedValue(baseEntity);

      const dto = {
        cardId: 123,
        condition: CardCondition.MINT,
        rarity: CardRarity.ULTRA_RARE,
        edition: CardEdition.FIRST_EDITION,
        isFoil: true,
        language: 'en',
      };

      await service.addCard('user-1', dto as any);

      expect(mockRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          notes: null,
          grade: null,
          purchasePrice: null,
        }),
      );
    });

    it('should increment quantity when existing entry is found', async () => {
      const existing = new UserCollectionEntity(
        'existing-1', 'user-1', 123, CardCondition.MINT, CardRarity.ULTRA_RARE,
        CardEdition.FIRST_EDITION, 1, true, 'en', null, null, null,
        new Date(), new Date(),
      );
      const updated = new UserCollectionEntity(
        'existing-1', 'user-1', 123, CardCondition.MINT, CardRarity.ULTRA_RARE,
        CardEdition.FIRST_EDITION, 3, true, 'en', null, null, null,
        new Date(), new Date(),
      );

      mockRepo.findByUnique.mockResolvedValue(existing);
      mockRepo.update.mockResolvedValue(updated);

      const result = await service.addCard('user-1', createDto as any);

      expect(mockRepo.update).toHaveBeenCalledWith('existing-1', { quantity: 3 });
      expect(result).toEqual(updated);
    });

    it('should throw NotFoundException when update fails after increment', async () => {
      const existing = new UserCollectionEntity(
        'existing-1', 'user-1', 123, CardCondition.MINT, CardRarity.ULTRA_RARE,
        CardEdition.FIRST_EDITION, 1, true, 'en', null, null, null,
        new Date(), new Date(),
      );

      mockRepo.findByUnique.mockResolvedValue(existing);
      mockRepo.update.mockResolvedValue(null);

      await expect(
        service.addCard('user-1', createDto as any),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateCard', () => {
    it('should update card fields', async () => {
      const updated = new UserCollectionEntity(
        'c1', 'user-1', 123, CardCondition.MINT, CardRarity.ULTRA_RARE,
        CardEdition.FIRST_EDITION, 5, true, 'en', 'new notes', '9.5', 100,
        new Date(), new Date(),
      );
      mockRepo.update.mockResolvedValue(updated);

      const result = await service.updateCard('c1', {
        quantity: 5,
        notes: 'new notes',
        grade: '9.5',
        purchasePrice: 100,
      } as any);

      expect(mockRepo.update).toHaveBeenCalledWith('c1', {
        quantity: 5,
        notes: 'new notes',
        grade: '9.5',
        purchasePrice: 100,
      });
      expect(result).toEqual(updated);
    });

    it('should only include defined fields in update input', async () => {
      mockRepo.update.mockResolvedValue(baseEntity);

      await service.updateCard('c1', { quantity: 3 } as any);

      expect(mockRepo.update).toHaveBeenCalledWith('c1', {
        quantity: 3,
      });
    });

    it('should throw NotFoundException when entry not found', async () => {
      mockRepo.update.mockResolvedValue(null);

      await expect(
        service.updateCard('nonexistent', { quantity: 3 } as any),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeCard', () => {
    it('should delete and return nothing when entry exists', async () => {
      mockRepo.delete.mockResolvedValue(baseEntity);

      await service.removeCard('c1');

      expect(mockRepo.delete).toHaveBeenCalledWith('c1');
    });

    it('should throw NotFoundException when entry not found', async () => {
      mockRepo.delete.mockResolvedValue(null);

      await expect(service.removeCard('nonexistent')).rejects.toThrow(
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
        byEdition: { FIRST_EDITION: 3, UNLIMITED: 2 },
        lastUpdated: new Date(),
      };
      mockRepo.getStats.mockResolvedValue(stats);

      const result = await service.getStats('user-1');

      expect(mockRepo.getStats).toHaveBeenCalledWith('user-1');
      expect(result).toEqual(stats);
    });
  });
});
