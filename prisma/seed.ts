import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

const USER_ID = 'user-test-001';

const cards = [
  {
    cardId: 4031928,
    condition: 'MINT',
    rarity: 'SECRET_RARE',
    edition: 'FIRST_EDITION',
    quantity: 1,
    isFoil: true,
    language: 'en',
    notes: 'Blue-Eyes White Dragon - Lobos de la Roca Azul',
    purchasePrice: 45.0,
  },
  {
    cardId: 7078105,
    condition: 'NEAR_MINT',
    rarity: 'ULTRA_RARE',
    edition: 'UNLIMITED',
    quantity: 2,
    isFoil: true,
    language: 'en',
    notes: 'Dark Magician - Mago Oscuro',
    purchasePrice: 28.5,
  },
  {
    cardId: 89631139,
    condition: 'MINT',
    rarity: 'STARLIGHT_RARE',
    edition: 'FIRST_EDITION',
    quantity: 1,
    isFoil: true,
    language: 'es',
    notes: 'Blue-Eyes Alternative White Dragon',
    grade: 'PSA 10',
    purchasePrice: 120.0,
  },
  {
    cardId: 14558127,
    condition: 'LIGHTLY_PLAYED',
    rarity: 'RARE',
    edition: 'UNLIMITED',
    quantity: 3,
    isFoil: false,
    language: 'en',
    notes: 'Exodia the Forbidden One - Piezas completas',
    purchasePrice: 15.0,
  },
  {
    cardId: 33879115,
    condition: 'NEAR_MINT',
    rarity: 'ULTRA_RARE',
    edition: 'FIRST_EDITION',
    quantity: 1,
    isFoil: true,
    language: 'en',
    notes: 'Pot of Greed - Taraceo de la Codicia',
    purchasePrice: 32.0,
  },
  {
    cardId: 5318639,
    condition: 'MINT',
    rarity: 'SUPER_RARE',
    edition: 'UNLIMITED',
    quantity: 1,
    isFoil: true,
    language: 'es',
    notes: 'Red-Eyes Black Dragon - Dragón Negro de Ojos Rojos',
    purchasePrice: 22.0,
  },
  {
    cardId: 74677422,
    condition: 'NEAR_MINT',
    rarity: 'SECRET_RARE',
    edition: 'FIRST_EDITION',
    quantity: 1,
    isFoil: true,
    language: 'en',
    notes: 'Stardust Dragon - Dragón Polvo Estelar',
    grade: 'CGC 9.5',
    purchasePrice: 55.0,
  },
  {
    cardId: 16195738,
    condition: 'PLAYED',
    rarity: 'COMMON',
    edition: 'UNLIMITED',
    quantity: 5,
    isFoil: false,
    language: 'es',
    notes: 'Kuriboh - Copa de Oscuridad',
    purchasePrice: 2.0,
  },
  {
    cardId: 97268402,
    condition: 'MINT',
    rarity: 'ULTIMATE_RARE',
    edition: 'FIRST_EDITION',
    quantity: 1,
    isFoil: true,
    language: 'en',
    notes: 'Elemental HERO Neos',
    purchasePrice: 18.0,
  },
  {
    cardId: 54620045,
    condition: 'NEAR_MINT',
    rarity: 'PRISMATIC_SECRET_RARE',
    edition: 'FIRST_EDITION',
    quantity: 1,
    isFoil: true,
    language: 'en',
    notes: 'Accesscode Talker - Carta moderna para deck competitivo',
    grade: 'PSA 9',
    purchasePrice: 38.0,
  },
];

async function main() {
  console.log('Seeding database...');

  for (const card of cards) {
    await prisma.userCollection.upsert({
      where: {
        userId_cardId_condition_rarity_edition_isFoil_language: {
          userId: USER_ID,
          cardId: card.cardId,
          condition: card.condition as any,
          rarity: card.rarity as any,
          edition: card.edition as any,
          isFoil: card.isFoil,
          language: card.language,
        },
      },
      update: {},
      create: {
        userId: USER_ID,
        cardId: card.cardId,
        condition: card.condition as any,
        rarity: card.rarity as any,
        edition: card.edition as any,
        quantity: card.quantity,
        isFoil: card.isFoil,
        language: card.language,
        notes: card.notes,
        grade: card.grade ?? null,
        purchasePrice: card.purchasePrice ?? null,
      },
    });
    console.log(`  ✓ Card ${card.cardId} (${card.notes})`);
  }

  console.log(`\nSeeded ${cards.length} cards for user "${USER_ID}"`);
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
