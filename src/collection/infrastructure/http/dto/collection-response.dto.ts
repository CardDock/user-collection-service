export class PaginationMetaDto {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export class CollectionResponseDto<T> {
  data: T[];
  meta: PaginationMetaDto;
}
