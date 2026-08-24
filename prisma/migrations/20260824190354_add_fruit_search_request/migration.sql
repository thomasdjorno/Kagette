-- CreateEnum
CREATE TYPE "FruitSearchStatus" AS ENUM ('OUVERTE', 'COMBLEE', 'ANNULEE');

-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "fruitSearchRequestId" TEXT;

-- CreateTable
CREATE TABLE "FruitSearchRequest" (
    "id" TEXT NOT NULL,
    "cuisinierId" TEXT NOT NULL,
    "variete" TEXT NOT NULL,
    "quantiteSouhaiteeKg" DOUBLE PRECISION,
    "message" TEXT,
    "regionId" TEXT NOT NULL,
    "statut" "FruitSearchStatus" NOT NULL DEFAULT 'OUVERTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FruitSearchRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_fruitSearchRequestId_fkey" FOREIGN KEY ("fruitSearchRequestId") REFERENCES "FruitSearchRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FruitSearchRequest" ADD CONSTRAINT "FruitSearchRequest_cuisinierId_fkey" FOREIGN KEY ("cuisinierId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FruitSearchRequest" ADD CONSTRAINT "FruitSearchRequest_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
