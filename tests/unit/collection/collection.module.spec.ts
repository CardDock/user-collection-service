import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { CollectionModule } from '../../../src/collection/collection.module';
import { PrismaModule } from '../../../src/prisma/prisma.module';
import { PrismaService } from '../../../src/prisma/prisma.service';

jest.mock('@prisma/adapter-pg', () => ({
  PrismaPg: jest.fn().mockImplementation(() => ({})),
}));

describe('CollectionModule', () => {
  it('should compile the module with all dependencies resolved', async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CollectionModule, PrismaModule],
    })
      .overrideProvider(PrismaService)
      .useValue(createMock<PrismaService>())
      .compile();

    expect(module).toBeDefined();
    expect(module.get(CollectionModule)).toBeInstanceOf(CollectionModule);
  });
});
