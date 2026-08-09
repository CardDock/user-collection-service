import { IsInt, IsEnum, IsString, IsOptional, Min } from 'class-validator';
import { CardCondition, CardRarity } from '../../../domain/enums';

export class CreateCollectionDto {
  @IsInt()
  cardId: number;

  @IsString()
  setId: string;

  @IsEnum(CardCondition)
  condition: CardCondition;

  @IsEnum(CardRarity)
  rarity: CardRarity;

  @IsString()
  language: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
