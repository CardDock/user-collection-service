import { IsOptional, IsInt, IsString, Min, IsEnum } from 'class-validator';
import { CardCondition, CardRarity } from '../../../domain/enums';

export class UpdateCollectionDto {
  @IsOptional()
  @IsEnum(CardCondition)
  condition?: CardCondition;

  @IsOptional()
  @IsEnum(CardRarity)
  rarity?: CardRarity;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number;

  @IsOptional()
  @IsString()
  setId?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
