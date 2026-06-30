import { UserCollectionEntity } from '../../../../src/collection/domain/user-collection.entity';

describe('UserCollectionEntity', () => {
  it('should create an instance with all properties', () => {
    const now = new Date();
    const entity = new UserCollectionEntity(
      '1',
      'user-1',
      123,
      'MINT' as any,
      'ULTRA_RARE' as any,
      'FIRST_EDITION' as any,
      2,
      true,
      'en',
      'some notes',
      '9.5',
      25.5,
      now,
      now,
    );

    expect(entity.id).toBe('1');
    expect(entity.userId).toBe('user-1');
    expect(entity.cardId).toBe(123);
    expect(entity.condition).toBe('MINT');
    expect(entity.rarity).toBe('ULTRA_RARE');
    expect(entity.edition).toBe('FIRST_EDITION');
    expect(entity.quantity).toBe(2);
    expect(entity.isFoil).toBe(true);
    expect(entity.language).toBe('en');
    expect(entity.notes).toBe('some notes');
    expect(entity.grade).toBe('9.5');
    expect(entity.purchasePrice).toBe(25.5);
    expect(entity.createdAt).toBe(now);
    expect(entity.updatedAt).toBe(now);
  });

  it('should allow nullable fields to be null', () => {
    const now = new Date();
    const entity = new UserCollectionEntity(
      '2',
      'user-2',
      456,
      'NEAR_MINT' as any,
      'RARE' as any,
      'UNLIMITED' as any,
      1,
      false,
      'ja',
      null,
      null,
      null,
      now,
      now,
    );

    expect(entity.notes).toBeNull();
    expect(entity.grade).toBeNull();
    expect(entity.purchasePrice).toBeNull();
  });

  it('should have all expected properties', () => {
    const now = new Date();
    const entity = new UserCollectionEntity(
      '3',
      'user-3',
      789,
      'PLAYED' as any,
      'COMMON' as any,
      'UNLIMITED' as any,
      3,
      false,
      'en',
      null,
      null,
      null,
      now,
      now,
    );

    expect(entity).toHaveProperty('id', '3');
    expect(entity).toHaveProperty('userId', 'user-3');
    expect(entity).toHaveProperty('cardId', 789);
    expect(entity).toHaveProperty('condition', 'PLAYED');
    expect(entity).toHaveProperty('rarity', 'COMMON');
    expect(entity).toHaveProperty('edition', 'UNLIMITED');
    expect(entity).toHaveProperty('quantity', 3);
    expect(entity).toHaveProperty('isFoil', false);
  });
});
