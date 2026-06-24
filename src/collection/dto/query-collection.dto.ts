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
import { $Enums } from '../../generated/prisma/client';

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
  @IsEnum($Enums.CardCondition)
  condition?: $Enums.CardCondition;

  @IsOptional()
  @IsEnum($Enums.CardRarity)
  rarity?: $Enums.CardRarity;

  @IsOptional()
  @IsEnum($Enums.CardEdition)
  edition?: $Enums.CardEdition;

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
