-- CreateEnum
CREATE TYPE "ModeRecolte" AS ENUM ('DEJA_RECOLTE', 'A_RECOLTER_SOI_MEME');

-- AlterTable
ALTER TABLE "FruitListing" ADD COLUMN     "modeRecolte" "ModeRecolte" NOT NULL DEFAULT 'A_RECOLTER_SOI_MEME';
