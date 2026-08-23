-- CreateTable
CREATE TABLE "Follow" (
    "id" TEXT NOT NULL,
    "suiveurId" TEXT NOT NULL,
    "suiviId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Follow_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Follow_suiveurId_suiviId_key" ON "Follow"("suiveurId", "suiviId");

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_suiveurId_fkey" FOREIGN KEY ("suiveurId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_suiviId_fkey" FOREIGN KEY ("suiviId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
