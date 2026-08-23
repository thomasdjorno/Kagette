-- CreateEnum
CREATE TYPE "RaisonDemande" AS ENUM ('TRANSFORMER_VENDRE', 'TRANSFORMER_CONSOMMER', 'CONSOMMER');

-- CreateEnum
CREATE TYPE "FruitRequestStatus" AS ENUM ('EN_ATTENTE', 'ACCEPTEE', 'REFUSEE');

-- AlterTable
ALTER TABLE "FruitListing" ADD COLUMN     "quantiteKg" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "FruitRequest" (
    "id" TEXT NOT NULL,
    "fruitListingId" TEXT NOT NULL,
    "demandeurId" TEXT NOT NULL,
    "quantiteDemandeeKg" DOUBLE PRECISION NOT NULL,
    "raison" "RaisonDemande" NOT NULL,
    "message" TEXT,
    "statut" "FruitRequestStatus" NOT NULL DEFAULT 'EN_ATTENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FruitRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FruitRequest" ADD CONSTRAINT "FruitRequest_fruitListingId_fkey" FOREIGN KEY ("fruitListingId") REFERENCES "FruitListing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FruitRequest" ADD CONSTRAINT "FruitRequest_demandeurId_fkey" FOREIGN KEY ("demandeurId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
