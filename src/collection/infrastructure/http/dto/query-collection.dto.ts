import {
  IsOptional,
  IsInt,
  Min,
  Max,
  IsEnum,
  IsBoolean,
  IsIn,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { CardCondition, CardRarity, CardEdition } from '../../../domain/enums';

const SORT_FIELDS = [
  'createdAt',
  'updatedAt',
  'cardId',
  'quantity',
  'condition',
  'rarity',
  'edition',
  'purchasePrice',
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
  @IsEnum(CardEdition)
  edition?: CardEdition;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isFoil?: boolean;

  @IsOptional()
  @IsIn(SORT_FIELDS)
  sort?: string = 'createdAt';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  order?: 'asc' | 'desc' = 'desc';
}
