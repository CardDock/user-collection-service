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
    setId: 'LOB',
    condition: 'MINT',
    rarity: 'SECRET_RARE',
    quantity: 1,
    language: 'en',
    notes: 'Blue-Eyes White Dragon - Lobos de la Roca Azul',
  },
  {
    cardId: 7078105,
    setId: 'SDY',
    condition: 'NEAR_MINT',
    rarity: 'ULTRA_RARE',
    quantity: 2,
    language: 'en',
    notes: 'Dark Magician - Mago Oscuro',
  },
  {
    cardId: 89631139,
    setId: 'LDK2',
    condition: 'MINT',
    rarity: 'STARLIGHT_RARE',
    quantity: 1,
    language: 'es',
    notes: 'Blue-Eyes Alternative White Dragon',
  },
  {
    cardId: 14558127,
    setId: 'LOB',
    condition: 'LIGHTLY_PLAYED',
    rarity: 'RARE',
    quantity: 3,
    language: 'en',
    notes: 'Exodia the Forbidden One - Piezas completas',
  },
  {
    cardId: 33879115,
    setId: 'LOB',
    condition: 'NEAR_MINT',
    rarity: 'ULTRA_RARE',
    quantity: 1,
    language: 'en',
    notes: 'Pot of Greed - Taraceo de la Codicia',
  },
  {
    cardId: 5318639,
    setId: 'SDJ',
    condition: 'MINT',
    rarity: 'SUPER_RARE',
    quantity: 1,
    language: 'es',
    notes: 'Red-Eyes Black Dragon - Dragón Negro de Ojos Rojos',
  },
  {
    cardId: 74677422,
    setId: 'COTD',
    condition: 'NEAR_MINT',
    rarity: 'SECRET_RARE',
    quantity: 1,
    language: 'en',
    notes: 'Stardust Dragon - Dragón Polvo Estelar',
  },
  {
    cardId: 16195738,
    setId: 'LOD',
    condition: 'PLAYED',
    rarity: 'COMMON',
    quantity: 5,
    language: 'es',
    notes: 'Kuriboh - Copa de Oscuridad',
  },
  {
    cardId: 97268402,
    setId: 'TLM',
    condition: 'MINT',
    rarity: 'ULTIMATE_RARE',
    quantity: 1,
    language: 'en',
    notes: 'Elemental HERO Neos',
  },
  {
    cardId: 54620045,
    setId: 'ETCO',
    condition: 'NEAR_MINT',
    rarity: 'PRISMATIC_SECRET_RARE',
    quantity: 1,
    language: 'en',
    notes: 'Accesscode Talker - Carta moderna para deck competitivo',
  },
];

async function main() {
  console.log('Seeding database...');

  await prisma.userCollection.deleteMany({ where: { userId: USER_ID } });

  for (const card of cards) {
    await prisma.userCollection.create({
      data: {
        userId: USER_ID,
        cardId: card.cardId,
        setId: card.setId,
        condition: card.condition as any,
        rarity: card.rarity as any,
        quantity: card.quantity,
        language: card.language,
        notes: card.notes,
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
