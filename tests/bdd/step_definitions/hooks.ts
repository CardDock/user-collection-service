import {
  BeforeAll,
  AfterAll,
  Before,
  setWorldConstructor,
  World,
} from '@cucumber/cucumber';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../../src/app.module';
import { PrismaService } from '../../../src/prisma/prisma.service';

let app: INestApplication;
let prisma: PrismaService;
let httpServer: any;

export function getAppHttpServer() {
  return httpServer;
}

export function getPrismaService() {
  return prisma;
}

export class CustomWorld extends World {
  response: request.Response | null = null;
}

setWorldConstructor(CustomWorld);

BeforeAll(async function () {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  app = moduleFixture.createNestApplication();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.init();

  prisma = app.get(PrismaService);
  httpServer = app.getHttpServer();
});

AfterAll(async function () {
  if (prisma) {
    await prisma.userCollection.deleteMany();
    await prisma.$disconnect();
  }
  if (app) await app.close();
});

const SEED_DATA = [
  {
    id: 'c1',
    userId: 'user-1',
    cardId: 123,
    condition: 'MINT',
    rarity: 'ULTRA_RARE',
    edition: 'FIRST_EDITION',
    quantity: 2,
    isFoil: true,
    language: 'en',
  },
  {
    id: 'c2',
    userId: 'user-1',
    cardId: 456,
    condition: 'NEAR_MINT',
    rarity: 'SUPER_RARE',
    edition: 'UNLIMITED',
    quantity: 1,
    isFoil: false,
    language: 'en',
  },
  {
    id: 'c3',
    userId: 'user-1',
    cardId: 789,
    condition: 'PLAYED',
    rarity: 'COMMON',
    edition: 'UNLIMITED',
    quantity: 3,
    isFoil: false,
    language: 'en',
  },
  {
    id: 'c4',
    userId: 'user-2',
    cardId: 123,
    condition: 'MINT',
    rarity: 'SECRET_RARE',
    edition: 'FIRST_EDITION',
    quantity: 1,
    isFoil: false,
    language: 'ja',
  },
];

export async function seedDefaultData(): Promise<void> {
  await prisma.userCollection.createMany({ data: SEED_DATA as any });
}

Before(async function () {
  await prisma.userCollection.deleteMany();
});

Before({ tags: 'not @noSeed' }, async function () {
  await seedDefaultData();
});
