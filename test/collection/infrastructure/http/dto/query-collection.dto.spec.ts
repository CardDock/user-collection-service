import 'reflect-metadata';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { QueryCollectionDto } from '../../../../../src/collection/infrastructure/http/dto/query-collection.dto';

describe('QueryCollectionDto', () => {
  it('should apply default values for page and limit', () => {
    const dto = plainToInstance(QueryCollectionDto, {});
    expect(dto.page).toBe(1);
    expect(dto.limit).toBe(20);
    expect(dto.sort).toBe('createdAt');
    expect(dto.order).toBe('desc');
  });

  it('should accept valid optional filters', async () => {
    const dto = plainToInstance(QueryCollectionDto, {
      page: 2,
      limit: 10,
      condition: 'MINT',
      rarity: 'ULTRA_RARE',
      edition: 'FIRST_EDITION',
      isFoil: 'true',
      sort: 'cardId',
      order: 'asc',
    });

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
    expect(dto.page).toBe(2);
    expect(dto.limit).toBe(10);
    expect(dto.condition).toBe('MINT');
    expect(dto.rarity).toBe('ULTRA_RARE');
    expect(dto.edition).toBe('FIRST_EDITION');
    expect(dto.isFoil).toBe(true);
    expect(dto.sort).toBe('cardId');
    expect(dto.order).toBe('asc');
  });

  it('should reject invalid enum values', async () => {
    const dto = plainToInstance(QueryCollectionDto, {
      condition: 'INVALID_CONDITION',
      rarity: 'INVALID_RARITY',
      edition: 'INVALID_EDITION',
    });

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThanOrEqual(1);
    const fieldNames = errors.map((e) => e.property);
    expect(fieldNames).toContain('condition');
    expect(fieldNames).toContain('rarity');
    expect(fieldNames).toContain('edition');
  });

  it('should reject limit exceeding max value', async () => {
    const dto = plainToInstance(QueryCollectionDto, { limit: 200 });
    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('limit');
  });

  it('should reject page below minimum', async () => {
    const dto = plainToInstance(QueryCollectionDto, { page: 0 });
    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('page');
  });

  it('should reject invalid sort fields', async () => {
    const dto = plainToInstance(QueryCollectionDto, {
      sort: 'invalidField',
    });
    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('sort');
  });

  it('should reject invalid order values', async () => {
    const dto = plainToInstance(QueryCollectionDto, {
      order: 'invalid',
    });
    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('order');
  });

  it('should transform isFoil string to boolean', () => {
    const dto = plainToInstance(QueryCollectionDto, { isFoil: 'true' });
    expect(dto.isFoil).toBe(true);

    const dto2 = plainToInstance(QueryCollectionDto, { isFoil: 'false' });
    expect(dto2.isFoil).toBe(false);
  });
});
