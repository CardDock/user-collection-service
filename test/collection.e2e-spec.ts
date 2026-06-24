import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';

describe('Collection (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
    );
    await app.init();

    prisma = app.get(PrismaService);
  });

  beforeEach(async () => {
    await prisma.userCollection.deleteMany();

    await prisma.userCollection.createMany({
      data: [
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
          language: 'ja',
        },
      ],
    });
  }, 10000);

  afterAll(async () => {
    await prisma.userCollection.deleteMany();
    await app.close();
  });

  describe('GET /api/v1/collections/:userId/cards', () => {
    it('should return paginated collection for a user', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/collections/user-1/cards')
        .expect(200);

      expect(res.body.data).toHaveLength(3);
      expect(res.body.meta).toEqual({
        page: 1,
        limit: 20,
        total: 3,
        totalPages: 1,
      });
    });

    it('should return empty array for user with no cards', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/collections/nonexistent/cards')
        .expect(200);

      expect(res.body.data).toEqual([]);
      expect(res.body.meta.total).toBe(0);
    });

    it('should filter by condition', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/collections/user-1/cards?condition=MINT')
        .expect(200);

      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].cardId).toBe(123);
    });

    it('should filter by rarity', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/collections/user-1/cards?rarity=SUPER_RARE')
        .expect(200);

      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].cardId).toBe(456);
    });

    it('should filter by isFoil', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/collections/user-1/cards?isFoil=true')
        .expect(200);

      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].isFoil).toBe(true);
    });

    it('should paginate correctly', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/collections/user-1/cards?page=1&limit=2')
        .expect(200);

      expect(res.body.data).toHaveLength(2);
      expect(res.body.meta.totalPages).toBe(2);
    });

    it('should return 400 for invalid enum value', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/collections/user-1/cards?condition=INVALID')
        .expect(400);

      expect(res.body.message).toBeDefined();
    });

    it('should return 400 for limit exceeding max', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/collections/user-1/cards?limit=200')
        .expect(400);

      expect(res.body.message).toBeDefined();
    });

    it('should return 400 for invalid sort field', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/collections/user-1/cards?sort=invalidField')
        .expect(400);

      expect(res.body.message).toBeDefined();
    });
  });

  describe('GET /api/v1/collections/:userId/cards/:cardId', () => {
    it('should return a single card entry', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/collections/user-1/cards/c1')
        .expect(200);

      expect(res.body.data.id).toBe('c1');
      expect(res.body.data.cardId).toBe(123);
    });

    it('should return 404 when card not found for user', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/collections/user-1/cards/nonexistent')
        .expect(404);

      expect(res.body.message).toContain('Card not found');
    });

    it('should return 404 when card belongs to different user', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/collections/user-1/cards/c4')
        .expect(404);

      expect(res.body.message).toContain('Card not found');
    });
  });
});
