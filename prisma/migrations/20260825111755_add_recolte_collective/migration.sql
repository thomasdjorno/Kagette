-- CreateTable
CREATE TABLE "RecolteCollective" (
    "id" TEXT NOT NULL,
    "fruitListingId" TEXT NOT NULL,
    "dateEvenement" TIMESTAMP(3) NOT NULL,
    "placesMax" INTEGER,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecolteCollective_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParticipationRecolte" (
    "id" TEXT NOT NULL,
    "recolteCollectiveId" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ParticipationRecolte_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RecolteCollective_fruitListingId_key" ON "RecolteCollective"("fruitListingId");

-- CreateIndex
CREATE UNIQUE INDEX "ParticipationRecolte_recolteCollectiveId_participantId_key" ON "ParticipationRecolte"("recolteCollectiveId", "participantId");

-- AddForeignKey
ALTER TABLE "RecolteCollective" ADD CONSTRAINT "RecolteCollective_fruitListingId_fkey" FOREIGN KEY ("fruitListingId") REFERENCES "FruitListing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParticipationRecolte" ADD CONSTRAINT "ParticipationRecolte_recolteCollectiveId_fkey" FOREIGN KEY ("recolteCollectiveId") REFERENCES "RecolteCollective"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParticipationRecolte" ADD CONSTRAINT "ParticipationRecolte_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
