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
    id: string,
    dto: UpdateCollectionDto,
  ): Promise<UserCollectionEntity>;

  removeCard(id: string): Promise<void>;

  getStats(userId: string): Promise<CollectionStats>;
}

export class ManageCollectionService implements ManageCollectionUseCase {
  constructor(private readonly repository: CollectionRepositoryPort) {}

  async addCard(
    userId: string,
    dto: CreateCollectionDto,
  ): Promise<UserCollectionEntity> {
    const existing = await this.repository.findByUnique({
      userId,
      cardId: dto.cardId,
      condition: dto.condition,
      rarity: dto.rarity,
      edition: dto.edition,
      isFoil: dto.isFoil,
      language: dto.language,
    });

    if (existing) {
      const newQuantity = existing.quantity + (dto.quantity ?? 1);
      const updated = await this.repository.update(existing.id, {
        quantity: newQuantity,
      });

      if (!updated) {
        throw new NotFoundException('Collection entry not found');
      }

      return updated;
    }

    const input: CreateCollectionInput = {
      userId,
      cardId: dto.cardId,
      condition: dto.condition,
      rarity: dto.rarity,
      edition: dto.edition,
      isFoil: dto.isFoil,
      language: dto.language,
      quantity: dto.quantity ?? 1,
      notes: dto.notes ?? null,
      grade: dto.grade ?? null,
      purchasePrice: dto.purchasePrice ?? null,
    };

    return this.repository.create(input);
  }

  async updateCard(
    id: string,
    dto: UpdateCollectionDto,
  ): Promise<UserCollectionEntity> {
    const input: UpdateCollectionInput = {};
    if (dto.quantity !== undefined) input.quantity = dto.quantity;
    if (dto.notes !== undefined) input.notes = dto.notes;
    if (dto.grade !== undefined) input.grade = dto.grade;
    if (dto.purchasePrice !== undefined)
      input.purchasePrice = dto.purchasePrice;

    const updated = await this.repository.update(id, input);

    if (!updated) {
      throw new NotFoundException('Collection entry not found');
    }

    return updated;
  }

  async removeCard(id: string): Promise<void> {
    const deleted = await this.repository.delete(id);

    if (!deleted) {
      throw new NotFoundException('Collection entry not found');
    }
  }

  async getStats(userId: string): Promise<CollectionStats> {
    return this.repository.getStats(userId);
  }
}
