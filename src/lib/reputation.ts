import { prisma } from "@/lib/prisma";

export interface Reputation {
  echanges: number;
  niveau: string;
  emoji: string;
}

function niveauDepuisEchanges(echanges: number): { niveau: string; emoji: string } {
  if (echanges >= 15) return { niveau: "Pilier de la communauté", emoji: "🌟" };
  if (echanges >= 5) return { niveau: "Kagetteur de confiance", emoji: "🤝" };
  if (echanges >= 1) return { niveau: "Kagetteur actif", emoji: "🌱" };
  return { niveau: "Nouveau membre", emoji: "👋" };
}

export async function calculerReputation(userId: string): Promise<Reputation> {
  const [commandesAcheteur, commandesCuisinier, demandesDemandeur, demandesDonneur] =
    await Promise.all([
      prisma.order.count({ where: { acheteurId: userId, statut: "RECUPEREE" } }),
      prisma.order.count({
        where: { productListing: { cuisinierId: userId }, statut: "RECUPEREE" },
      }),
      prisma.fruitRequest.count({ where: { demandeurId: userId, statut: "ACCEPTEE" } }),
      prisma.fruitRequest.count({
        where: { fruitListing: { donneurId: userId }, statut: "ACCEPTEE" },
      }),
    ]);

  const echanges = commandesAcheteur + commandesCuisinier + demandesDemandeur + demandesDonneur;

  return { echanges, ...niveauDepuisEchanges(echanges) };
}
