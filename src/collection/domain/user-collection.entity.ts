import { CardCondition, CardRarity } from './enums';

export class UserCollectionEntity {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly cardId: number,
    public readonly setId: string,
    public readonly condition: CardCondition,
    public readonly rarity: CardRarity,
    public readonly quantity: number,
    public readonly language: string,
    public readonly notes: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
