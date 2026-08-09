import { IsOptional, IsInt, Min, Max, IsEnum, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { CardCondition, CardRarity } from '../../../domain/enums';

const SORT_FIELDS = [
  'createdAt',
  'updatedAt',
  'cardId',
  'quantity',
  'condition',
  'rarity',
] as const;

export class QueryCollectionDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @IsOptional()
  @IsEnum(CardCondition)
  condition?: CardCondition;

  @IsOptional()
  @IsEnum(CardRarity)
  rarity?: CardRarity;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  cardId?: number;

  @IsOptional()
  @IsIn(SORT_FIELDS)
  sort?: string = 'createdAt';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  order?: 'asc' | 'desc' = 'desc';
}
