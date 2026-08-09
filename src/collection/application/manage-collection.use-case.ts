import { NotFoundException } from '@nestjs/common';
import type {
  CollectionRepositoryPort,
  CreateCollectionInput,
  UpdateCollectionInput,
  CollectionStats,
} from '../domain/collection-repository.port';
import type { CreateCollectionDto } from '../infrastructure/http/dto/create-collection.dto';
import type { UpdateCollectionDto } from '../infrastructure/http/dto/update-collection.dto';
import { UserCollectionEntity } from '../domain/user-collection.entity';

export const MANAGE_COLLECTION_USE_CASE = Symbol('MANAGE_COLLECTION_USE_CASE');

export interface ManageCollectionUseCase {
  addCard(
    userId: string,
    dto: CreateCollectionDto,
  ): Promise<UserCollectionEntity>;

  updateCard(
    userId: string,
    id: string,
    dto: UpdateCollectionDto,
  ): Promise<UserCollectionEntity>;

  removeCard(userId: string, id: string): Promise<void>;

  getStats(userId: string): Promise<CollectionStats>;
}

export class ManageCollectionService implements ManageCollectionUseCase {
  constructor(private readonly repository: CollectionRepositoryPort) {}

  async addCard(
    userId: string,
    dto: CreateCollectionDto,
  ): Promise<UserCollectionEntity> {
    const input: CreateCollectionInput = {
      userId,
      cardId: dto.cardId,
      setId: dto.setId,
      condition: dto.condition,
      rarity: dto.rarity,
      language: dto.language,
      quantity: dto.quantity ?? 1,
      notes: dto.notes ?? null,
    };

    return this.repository.create(input);
  }

  async updateCard(
    userId: string,
    id: string,
    dto: UpdateCollectionDto,
  ): Promise<UserCollectionEntity> {
    const entry = await this.repository.findFirst({ id, userId });

    if (!entry) {
      throw new NotFoundException('Collection entry not found');
    }

    const input: UpdateCollectionInput = {};
    if (dto.condition !== undefined) input.condition = dto.condition;
    if (dto.rarity !== undefined) input.rarity = dto.rarity;
    if (dto.language !== undefined) input.language = dto.language;
    if (dto.quantity !== undefined) input.quantity = dto.quantity;
    if (dto.setId !== undefined) input.setId = dto.setId;
    if (dto.notes !== undefined) input.notes = dto.notes;

    return this.repository.update(id, input) as Promise<UserCollectionEntity>;
  }

  async removeCard(userId: string, id: string): Promise<void> {
    const entry = await this.repository.findFirst({ id, userId });

    if (!entry) {
      throw new NotFoundException('Collection entry not found');
    }

    await this.repository.delete(id);
  }

  async getStats(userId: string): Promise<CollectionStats> {
    return this.repository.getStats(userId);
  }
}
