import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { CollectionController } from '../../../../../src/collection/infrastructure/http/collection.controller';
import {
  GET_COLLECTION_USE_CASE,
  GetCollectionUseCase,
} from '../../../../../src/collection/application/get-collection.use-case';
import {
  MANAGE_COLLECTION_USE_CASE,
  ManageCollectionUseCase,
} from '../../../../../src/collection/application/manage-collection.use-case';
import { UserCollectionEntity } from '../../../../../src/collection/domain/user-collection.entity';
import {
  CardCondition,
  CardRarity,
} from '../../../../../src/collection/domain/enums';
import { CreateCollectionDto } from '../../../../../src/collection/infrastructure/http/dto/create-collection.dto';
import { UpdateCollectionDto } from '../../../../../src/collection/infrastructure/http/dto/update-collection.dto';

describe('CollectionController', () => {
  let controller: CollectionController;
  let mockGetUseCase: jest.Mocked<GetCollectionUseCase>;
  let mockManageUseCase: jest.Mocked<ManageCollectionUseCase>;

  beforeEach(async () => {
    mockGetUseCase = createMock<GetCollectionUseCase>();
    mockManageUseCase = createMock<ManageCollectionUseCase>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CollectionController],
      providers: [
        { provide: GET_COLLECTION_USE_CASE, useValue: mockGetUseCase },
        { provide: MANAGE_COLLECTION_USE_CASE, useValue: mockManageUseCase },
      ],
    }).compile();

    controller = module.get<CollectionController>(CollectionController);
    jest.clearAllMocks();
  });

  describe('findByUser', () => {
    it('should call use case with mapped query parameters', async () => {
      const paginatedResult = {
        data: [],
        meta: { page: 1, limit: 20, total: 0, totalPages: 0 },
      };
      mockGetUseCase.findByUser.mockResolvedValue(paginatedResult);

      const result = await controller.findByUser('user-1', {
        page: 1,
        limit: 20,
        sort: 'createdAt',
        order: 'desc',
      } as any);

      expect(mockGetUseCase.findByUser).toHaveBeenCalledWith('user-1', {
        page: 1,
        limit: 20,
        condition: undefined,
        rarity: undefined,
        cardId: undefined,
        sort: 'createdAt',
        order: 'desc',
      });
      expect(result).toEqual(paginatedResult);
    });

    it('should pass optional filters from the DTO', async () => {
      mockGetUseCase.findByUser.mockResolvedValue({
        data: [],
        meta: { page: 1, limit: 20, total: 0, totalPages: 0 },
      });

      await controller.findByUser('user-1', {
        page: 2,
        limit: 10,
        condition: 'MINT',
        rarity: 'ULTRA_RARE',
        cardId: 4031928,
        sort: 'cardId',
        order: 'asc',
      } as any);

      expect(mockGetUseCase.findByUser).toHaveBeenCalledWith('user-1', {
        page: 2,
        limit: 10,
        condition: 'MINT',
        rarity: 'ULTRA_RARE',
        cardId: 4031928,
        sort: 'cardId',
        order: 'asc',
      });
    });
  });

  describe('findOne', () => {
    it('should return the card when found', async () => {
      const entity = new UserCollectionEntity(
        'c1',
        'user-1',
        123,
        'LOB',
        CardCondition.MINT,
        CardRarity.ULTRA_RARE,
        1,
        'en',
        null,
        new Date(),
        new Date(),
      );
      mockGetUseCase.findOne.mockResolvedValue(entity);

      const result = await controller.findOne('c1');

      expect(mockGetUseCase.findOne).toHaveBeenCalledWith('c1');
      expect(result).toEqual({ data: entity });
    });

    it('should throw NotFoundException when card is not found', async () => {
      mockGetUseCase.findOne.mockResolvedValue(null);

      await expect(controller.findOne('nonexistent')).rejects.toThrow(
        'Collection entry not found',
      );
    });
  });

  describe('addCard', () => {
    it('should call use case and return created card', async () => {
      const entity = new UserCollectionEntity(
        'c1', 'user-1', 123, 'LOB', CardCondition.MINT, CardRarity.ULTRA_RARE,
        2, 'en', null, new Date(), new Date(),
      );
      const dto = new CreateCollectionDto();
      Object.assign(dto, {
        cardId: 123, setId: 'LOB', condition: CardCondition.MINT,
        rarity: CardRarity.ULTRA_RARE, language: 'en', quantity: 2,
      });

      mockManageUseCase.addCard.mockResolvedValue(entity);

      const result = await controller.addCard('user-1', dto);

      expect(mockManageUseCase.addCard).toHaveBeenCalledWith('user-1', dto);
      expect(result).toEqual({ data: entity });
    });
  });

  describe('updateCard', () => {
    it('should call use case with userId and id and return updated card', async () => {
      const entity = new UserCollectionEntity(
        'c1', 'user-1', 123, 'LOB', CardCondition.MINT, CardRarity.ULTRA_RARE,
        5, 'en', 'updated notes', new Date(), new Date(),
      );
      const dto = new UpdateCollectionDto();
      Object.assign(dto, { quantity: 5, notes: 'updated notes' });

      mockManageUseCase.updateCard.mockResolvedValue(entity);

      const result = await controller.updateCard('user-1', 'c1', dto);

      expect(mockManageUseCase.updateCard).toHaveBeenCalledWith('user-1', 'c1', dto);
      expect(result).toEqual({ data: entity });
    });
  });

  describe('removeCard', () => {
    it('should call use case with userId and id and return nothing', async () => {
      mockManageUseCase.removeCard.mockResolvedValue(undefined);

      const result = await controller.removeCard('user-1', 'c1');

      expect(mockManageUseCase.removeCard).toHaveBeenCalledWith('user-1', 'c1');
      expect(result).toBeUndefined();
    });
  });

  describe('getStats', () => {
    it('should call use case and return stats', async () => {
      const stats = {
        totalEntries: 10,
        uniqueCardIds: 5,
        totalQuantity: 25,
        byRarity: { ULTRA_RARE: 3 },
        byCondition: { MINT: 4 },
        lastUpdated: new Date(),
      };
      mockManageUseCase.getStats.mockResolvedValue(stats);

      const result = await controller.getStats('user-1');

      expect(mockManageUseCase.getStats).toHaveBeenCalledWith('user-1');
      expect(result).toEqual({ data: stats });
    });
  });
});
