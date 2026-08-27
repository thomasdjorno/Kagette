import { prisma } from "@/lib/prisma";
import { creerNotification } from "@/lib/notifications";
import type { ProductCategory } from "@prisma/client";

/**
 * Vérifie les alertes de disponibilité pas encore déclenchées et notifie
 * les acheteurs dont le critère (mot-clé et/ou catégorie) correspond au
 * produit qui vient d'être publié. Chaque alerte ne se déclenche qu'une
 * fois.
 */
export async function declencherAlertesDisponibilite(listing: {
  id: string;
  titre: string;
  categorie: ProductCategory;
}) {
  const alertesActives = await prisma.alerteDisponibilite.findMany({
    where: { declenchee: false },
  });

  const titreMinuscule = listing.titre.toLowerCase();
  const alertesDeclenchees = alertesActives.filter((alerte) => {
    const categorieOk = !alerte.categorie || alerte.categorie === listing.categorie;
    const critereOk = !alerte.critere || titreMinuscule.includes(alerte.critere.toLowerCase());
    return categorieOk && critereOk;
  });

  await Promise.all(
    alertesDeclenchees.map((alerte) =>
      Promise.all([
        prisma.alerteDisponibilite.update({
          where: { id: alerte.id },
          data: { declenchee: true },
        }),
        creerNotification({
          userId: alerte.userId,
          message: `${listing.titre} vient d'être publié, exactement ce que tu cherchais !`,
          lien: `/produits/${listing.id}`,
        }),
      ])
    )
  );
}
