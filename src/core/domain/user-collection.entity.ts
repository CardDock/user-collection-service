import { $Enums } from '@prisma/client';

export type CardCondition = $Enums.CardCondition;
export type CardRarity = $Enums.CardRarity;
export type CardEdition = $Enums.CardEdition;

export class UserCollectionEntity {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly cardId: number,
    public readonly condition: CardCondition,
    public readonly rarity: CardRarity,
    public readonly edition: CardEdition,
    public readonly quantity: number,
    public readonly isFoil: boolean,
    public readonly language: string,
    public readonly notes: string | null,
    public readonly grade: string | null,
    public readonly purchasePrice: number | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
