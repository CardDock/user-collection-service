import 'reflect-metadata';

jest.mock('@prisma/adapter-pg', () => ({
  PrismaPg: jest.fn().mockReturnValue({}),
}));

// Ensure PrismaClient constructor does not try to connect
jest.mock('@prisma/client', () => {
  class MockPrismaClient {
    $connect = jest.fn();
    $disconnect = jest.fn();
  }
  return { PrismaClient: MockPrismaClient };
});

describe('PrismaService', () => {
  beforeAll(() => {
    process.env.DATABASE_URL = 'postgresql://test:test@localhost/test';
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', async () => {
    const { PrismaService } = await import('../../src/prisma/prisma.service');
    const service = new PrismaService();
    expect(service).toBeDefined();
    expect(typeof service.onModuleInit).toBe('function');
    expect(typeof service.onModuleDestroy).toBe('function');
  });

  it('should call $connect on module init', async () => {
    const { PrismaService } = await import('../../src/prisma/prisma.service');
    const service = new PrismaService();

    await service.onModuleInit();

    expect(service.$connect).toHaveBeenCalled();
  });

  it('should call $disconnect on module destroy', async () => {
    const { PrismaService } = await import('../../src/prisma/prisma.service');
    const service = new PrismaService();

    await service.onModuleDestroy();

    expect(service.$disconnect).toHaveBeenCalled();
  });
});
