import {
  IsInt,
  IsEnum,
  IsBoolean,
  IsString,
  IsOptional,
  Min,
  IsNumber,
} from 'class-validator';
import { CardCondition, CardRarity, CardEdition } from '../../../domain/enums';

export class CreateCollectionDto {
  @IsInt()
  cardId: number;

  @IsEnum(CardCondition)
  condition: CardCondition;

  @IsEnum(CardRarity)
  rarity: CardRarity;

  @IsEnum(CardEdition)
  edition: CardEdition;

  @IsBoolean()
  isFoil: boolean;

  @IsString()
  language: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  grade?: string;

  @IsOptional()
  @IsNumber()
  purchasePrice?: number;
}
