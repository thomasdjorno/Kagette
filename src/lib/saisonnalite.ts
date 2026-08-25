export interface FruitSaison {
  nom: string;
  emoji: string;
  // Mois de récolte typiques en Dordogne, 1 = janvier ... 12 = décembre
  mois: number[];
}

export const fruitsSaisonDordogne: FruitSaison[] = [
  { nom: "Fraise", emoji: "🍓", mois: [5, 6, 7] },
  { nom: "Cerise", emoji: "🍒", mois: [6, 7] },
  { nom: "Framboise", emoji: "🫐", mois: [6, 7, 8, 9] },
  { nom: "Abricot", emoji: "🍑", mois: [7, 8] },
  { nom: "Pêche", emoji: "🍑", mois: [7, 8, 9] },
  { nom: "Mirabelle", emoji: "🟡", mois: [8, 9] },
  { nom: "Prune", emoji: "🟣", mois: [8, 9] },
  { nom: "Figue", emoji: "🟤", mois: [8, 9, 10] },
  { nom: "Raisin", emoji: "🍇", mois: [9, 10] },
  { nom: "Pomme", emoji: "🍎", mois: [9, 10, 11] },
  { nom: "Poire", emoji: "🍐", mois: [9, 10, 11] },
  { nom: "Coing", emoji: "🍐", mois: [10, 11] },
  { nom: "Noix", emoji: "🌰", mois: [10, 11] },
  { nom: "Châtaigne", emoji: "🌰", mois: [10, 11] },
  { nom: "Kiwi", emoji: "🥝", mois: [11, 12, 1] },
];

export const libellesMois = [
  "Jan",
  "Fév",
  "Mar",
  "Avr",
  "Mai",
  "Juin",
  "Juil",
  "Août",
  "Sep",
  "Oct",
  "Nov",
  "Déc",
];

export function fruitsDeSaison(mois: number, data: FruitSaison[] = fruitsSaisonDordogne): FruitSaison[] {
  return data.filter((f) => f.mois.includes(mois));
}

const libellesMoisComplets = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
];

/**
 * Formate une liste de mois (triée, éventuellement à cheval sur le
 * changement d'année comme le kiwi [11, 12, 1]) en texte lisible, ex.
 * "Août - Octobre" ou "Novembre - Janvier".
 */
export function periodeTexte(mois: number[]): string {
  if (mois.length === 0) return "";
  const debut = mois[0];
  const fin = mois[mois.length - 1];
  if (debut === fin) return libellesMoisComplets[debut - 1];
  return `${libellesMoisComplets[debut - 1]} - ${libellesMoisComplets[fin - 1]}`;
}
