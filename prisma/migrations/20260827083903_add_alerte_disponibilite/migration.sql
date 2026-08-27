-- CreateTable
CREATE TABLE "AlerteDisponibilite" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "critere" TEXT,
    "categorie" "ProductCategory",
    "declenchee" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AlerteDisponibilite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AlerteDisponibilite_declenchee_idx" ON "AlerteDisponibilite"("declenchee");

-- AddForeignKey
ALTER TABLE "AlerteDisponibilite" ADD CONSTRAINT "AlerteDisponibilite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
