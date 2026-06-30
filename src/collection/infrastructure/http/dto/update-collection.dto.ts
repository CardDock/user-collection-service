import { IsOptional, IsInt, IsString, IsNumber, Min } from 'class-validator';

export class UpdateCollectionDto {
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
