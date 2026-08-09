import { UserCollectionEntity } from '../../../../src/collection/domain/user-collection.entity';

describe('UserCollectionEntity', () => {
  it('should create an instance with all properties', () => {
    const now = new Date();
    const entity = new UserCollectionEntity(
      '1',
      'user-1',
      123,
      'LOB',
      'MINT' as any,
      'ULTRA_RARE' as any,
      2,
      'en',
      'some notes',
      now,
      now,
    );

    expect(entity.id).toBe('1');
    expect(entity.userId).toBe('user-1');
    expect(entity.cardId).toBe(123);
    expect(entity.setId).toBe('LOB');
    expect(entity.condition).toBe('MINT');
    expect(entity.rarity).toBe('ULTRA_RARE');
    expect(entity.quantity).toBe(2);
    expect(entity.language).toBe('en');
    expect(entity.notes).toBe('some notes');
    expect(entity.createdAt).toBe(now);
    expect(entity.updatedAt).toBe(now);
  });

  it('should allow nullable fields to be null', () => {
    const now = new Date();
    const entity = new UserCollectionEntity(
      '2',
      'user-2',
      456,
      'SDY',
      'NEAR_MINT' as any,
      'RARE' as any,
      1,
      'ja',
      null,
      now,
      now,
    );

    expect(entity.notes).toBeNull();
  });

  it('should have all expected properties', () => {
    const now = new Date();
    const entity = new UserCollectionEntity(
      '3',
      'user-3',
      789,
      'LOB',
      'PLAYED' as any,
      'COMMON' as any,
      3,
      'en',
      null,
      now,
      now,
    );

    expect(entity).toHaveProperty('id', '3');
    expect(entity).toHaveProperty('userId', 'user-3');
    expect(entity).toHaveProperty('cardId', 789);
    expect(entity).toHaveProperty('setId', 'LOB');
    expect(entity).toHaveProperty('condition', 'PLAYED');
    expect(entity).toHaveProperty('rarity', 'COMMON');
    expect(entity).toHaveProperty('quantity', 3);
  });
});
