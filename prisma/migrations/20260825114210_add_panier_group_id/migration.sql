-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "panierGroupId" TEXT;

-- CreateIndex
CREATE INDEX "Order_panierGroupId_idx" ON "Order"("panierGroupId");
