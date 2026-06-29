import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { CollectionController } from '../../../../src/collection/infrastructure/http/collection.controller';
import {
  GET_COLLECTION_USE_CASE,
  GetCollectionUseCase,
} from '../../../../src/collection/application/get-collection.use-case';
import { UserCollectionEntity } from '../../../../src/collection/domain/user-collection.entity';

describe('CollectionController', () => {
  let controller: CollectionController;
  let mockUseCase: jest.Mocked<GetCollectionUseCase>;

  beforeEach(async () => {
    mockUseCase = createMock<GetCollectionUseCase>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CollectionController],
      providers: [
        { provide: GET_COLLECTION_USE_CASE, useValue: mockUseCase },
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
      mockUseCase.findByUser.mockResolvedValue(paginatedResult);

      const result = await controller.findByUser('user-1', {
        page: 1,
        limit: 20,
        sort: 'createdAt',
        order: 'desc',
      } as any);

      expect(mockUseCase.findByUser).toHaveBeenCalledWith('user-1', {
        page: 1,
        limit: 20,
        condition: undefined,
        rarity: undefined,
        edition: undefined,
        isFoil: undefined,
        sort: 'createdAt',
        order: 'desc',
      });
      expect(result).toEqual(paginatedResult);
    });

    it('should pass optional filters from the DTO', async () => {
      mockUseCase.findByUser.mockResolvedValue({
        data: [],
        meta: { page: 1, limit: 20, total: 0, totalPages: 0 },
      });

      await controller.findByUser('user-1', {
        page: 2,
        limit: 10,
        condition: 'MINT',
        rarity: 'ULTRA_RARE',
        edition: 'FIRST_EDITION',
        isFoil: true,
        sort: 'cardId',
        order: 'asc',
      } as any);

      expect(mockUseCase.findByUser).toHaveBeenCalledWith('user-1', {
        page: 2,
        limit: 10,
        condition: 'MINT',
        rarity: 'ULTRA_RARE',
        edition: 'FIRST_EDITION',
        isFoil: true,
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
        'MINT' as any,
        'ULTRA_RARE' as any,
        'FIRST_EDITION' as any,
        1,
        false,
        'en',
        null,
        null,
        null,
        new Date(),
        new Date(),
      );
      mockUseCase.findOne.mockResolvedValue(entity);

      const result = await controller.findOne('user-1', 'c1');

      expect(mockUseCase.findOne).toHaveBeenCalledWith('user-1', 'c1');
      expect(result).toEqual({ data: entity });
    });

    it('should throw NotFoundException when card is not found', async () => {
      mockUseCase.findOne.mockResolvedValue(null);

      await expect(controller.findOne('user-1', 'nonexistent')).rejects.toThrow(
        'Card not found in collection',
      );
    });
  });
});
