export interface Pourcentages {
  donneurPercent: number;
  cuisinierPercent: number;
  commissionPercent: number;
}

export interface Repartition {
  montantTotal: number;
  montantDonneur: number;
  montantCuisinier: number;
  montantPlateforme: number;
}

/**
 * Répartit un montant en 3 parts (donneur / cuisinier / plateforme).
 *
 * Le calcul se fait en centimes entiers pour éviter les erreurs
 * d'arrondi flottant. La commission plateforme et la part donneur sont
 * arrondies au centime le plus proche ; la part cuisinier absorbe le reste,
 * ce qui garantit que la somme des 3 parts est toujours exactement égale au
 * montant total (jamais un centime perdu ou en trop).
 *
 * Si aucun donneur n'est identifié (produit sans traçabilité vers une
 * annonce de fruits), sa part est nulle et revient au cuisinier.
 */
export function calculerRepartition(
  montantTotal: number,
  pourcentages: Pourcentages,
  aUnDonneur: boolean
): Repartition {
  const totalCents = Math.round(montantTotal * 100);

  const donneurCents = aUnDonneur
    ? Math.round((totalCents * pourcentages.donneurPercent) / 100)
    : 0;
  const plateformeCents = Math.round((totalCents * pourcentages.commissionPercent) / 100);
  const cuisinierCents = totalCents - donneurCents - plateformeCents;

  return {
    montantTotal: totalCents / 100,
    montantDonneur: donneurCents / 100,
    montantCuisinier: cuisinierCents / 100,
    montantPlateforme: plateformeCents / 100,
  };
}
