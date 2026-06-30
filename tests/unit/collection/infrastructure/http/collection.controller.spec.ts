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
  CardEdition,
} from '../../../../../src/collection/domain/enums';

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
        edition: undefined,
        isFoil: undefined,
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
        edition: 'FIRST_EDITION',
        isFoil: true,
        sort: 'cardId',
        order: 'asc',
      } as any);

      expect(mockGetUseCase.findByUser).toHaveBeenCalledWith('user-1', {
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
});
