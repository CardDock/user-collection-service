import 'reflect-metadata';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { UpdateCollectionDto } from '../../../../../../src/collection/infrastructure/http/dto/update-collection.dto';

describe('UpdateCollectionDto', () => {
  it('should accept an empty DTO (all fields optional)', async () => {
    const dto = plainToInstance(UpdateCollectionDto, {});
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should accept valid fields', async () => {
    const dto = plainToInstance(UpdateCollectionDto, {
      quantity: 5,
      notes: 'updated notes',
      grade: '9.5',
      purchasePrice: 30.0,
    });
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('should reject quantity less than 1', async () => {
    const dto = plainToInstance(UpdateCollectionDto, { quantity: 0 });
    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('quantity');
  });

  it('should reject non-integer quantity', async () => {
    const dto = plainToInstance(UpdateCollectionDto, { quantity: 1.5 });
    const errors = await validate(dto);
    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('quantity');
  });

  it('should accept partial updates with a single field', async () => {
    const dto = plainToInstance(UpdateCollectionDto, { notes: 'just notes' });
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});
