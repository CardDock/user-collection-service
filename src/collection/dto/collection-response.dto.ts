import { Expose } from 'class-transformer';

class PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export class CollectionResponseDto<T> {
  data: T[];

  @Expose()
  meta: PaginationMeta;
}
