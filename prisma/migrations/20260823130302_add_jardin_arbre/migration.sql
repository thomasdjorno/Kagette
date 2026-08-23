-- CreateEnum
CREATE TYPE "Saison" AS ENUM ('PRINTEMPS', 'ETE', 'AUTOMNE', 'HIVER');

-- CreateEnum
CREATE TYPE "UniteQuantite" AS ENUM ('KG', 'CAGETTE', 'AUTRE');

-- CreateEnum
CREATE TYPE "UrgenceRecolte" AS ENUM ('PAS_PRESSE', 'BIENTOT', 'URGENT');

-- AlterTable
ALTER TABLE "FruitListing" ADD COLUMN     "arbreId" TEXT;

-- CreateTable
CREATE TABLE "Jardin" (
    "id" TEXT NOT NULL,
    "proprietaireId" TEXT NOT NULL,
    "nom" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Jardin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Arbre" (
    "id" TEXT NOT NULL,
    "jardinId" TEXT NOT NULL,
    "variete" TEXT NOT NULL,
    "saison" "Saison" NOT NULL,
    "quantite" DOUBLE PRECISION NOT NULL,
    "unite" "UniteQuantite" NOT NULL DEFAULT 'KG',
    "modeRecolte" "ModeRecolte" NOT NULL DEFAULT 'A_RECOLTER_SOI_MEME',
    "urgenceRecolte" "UrgenceRecolte" NOT NULL DEFAULT 'PAS_PRESSE',
    "photoUrl" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Arbre_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Jardin_proprietaireId_key" ON "Jardin"("proprietaireId");

-- AddForeignKey
ALTER TABLE "FruitListing" ADD CONSTRAINT "FruitListing_arbreId_fkey" FOREIGN KEY ("arbreId") REFERENCES "Arbre"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Jardin" ADD CONSTRAINT "Jardin_proprietaireId_fkey" FOREIGN KEY ("proprietaireId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Arbre" ADD CONSTRAINT "Arbre_jardinId_fkey" FOREIGN KEY ("jardinId") REFERENCES "Jardin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
