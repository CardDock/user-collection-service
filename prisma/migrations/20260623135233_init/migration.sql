-- CreateEnum
CREATE TYPE "CardCondition" AS ENUM ('MINT', 'NEAR_MINT', 'LIGHTLY_PLAYED', 'PLAYED', 'DAMAGED');

-- CreateEnum
CREATE TYPE "CardRarity" AS ENUM ('COMMON', 'RARE', 'SUPER_RARE', 'ULTRA_RARE', 'SECRET_RARE', 'ULTIMATE_RARE', 'GHOST_RARE', 'PRISMATIC_SECRET_RARE', 'STARLIGHT_RARE', 'COLLECTORS_RARE');

-- CreateEnum
CREATE TYPE "CardEdition" AS ENUM ('FIRST_EDITION', 'UNLIMITED');

-- CreateTable
CREATE TABLE "user_collections" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "card_id" INTEGER NOT NULL,
    "condition" "CardCondition" NOT NULL,
    "rarity" "CardRarity" NOT NULL,
    "edition" "CardEdition" NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "is_foil" BOOLEAN NOT NULL DEFAULT false,
    "language" TEXT NOT NULL DEFAULT 'en',
    "notes" TEXT,
    "grade" TEXT,
    "purchase_price" DECIMAL(10,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_collections_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_collections_user_id_idx" ON "user_collections"("user_id");

-- CreateIndex
CREATE INDEX "user_collections_card_id_idx" ON "user_collections"("card_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_collections_user_id_card_id_condition_rarity_edition_i_key" ON "user_collections"("user_id", "card_id", "condition", "rarity", "edition", "is_foil", "language");
