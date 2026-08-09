import 'reflect-metadata';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateCollectionDto } from '../../../../../../src/collection/infrastructure/http/dto/create-collection.dto';

describe('CreateCollectionDto', () => {
  const validDto = {
    cardId: 123,
    setId: 'LOB',
    condition: 'MINT',
    rarity: 'ULTRA_RARE',
    language: 'en',
  };

  it('should accept a valid DTO', async () => {
    const dto = plainToInstance(CreateCollectionDto, validDto);
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should accept optional fields', async () => {
    const dto = plainToInstance(CreateCollectionDto, {
      ...validDto,
      quantity: 3,
      notes: 'my notes',
    });
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should reject missing required fields', async () => {
    const dto = plainToInstance(CreateCollectionDto, {});
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThanOrEqual(5);
    const fieldNames = errors.map((e) => e.property);
    expect(fieldNames).toContain('cardId');
    expect(fieldNames).toContain('setId');
    expect(fieldNames).toContain('condition');
    expect(fieldNames).toContain('rarity');
    expect(fieldNames).toContain('language');
  });

  it('should reject invalid enum values', async () => {
    const dto = plainToInstance(CreateCollectionDto, {
      ...validDto,
      condition: 'INVALID',
      rarity: 'INVALID',
    });
    const errors = await validate(dto);
    const fieldNames = errors.map((e) => e.property);
    expect(fieldNames).toContain('condition');
    expect(fieldNames).toContain('rarity');
  });

  it('should reject cardId that is not an integer', async () => {
    const dto = plainToInstance(CreateCollectionDto, {
      ...validDto,
      cardId: 'abc' as any,
    });
    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('cardId');
  });

  it('should reject quantity less than 1', async () => {
    const dto = plainToInstance(CreateCollectionDto, {
      ...validDto,
      quantity: 0,
    });
    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('quantity');
  });
});
