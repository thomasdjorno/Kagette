export function formatPrix(montant: number | string) {
  const valeur = typeof montant === "string" ? parseFloat(montant) : montant;
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(valeur);
}

export function formatDate(date: Date | string) {
  const valeur = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(
    valeur
  );
}

export const libellesBadgeHygiene: Record<string, string> = {
  NON_DEMANDE: "Aucune demande en cours",
  EN_ATTENTE: "Badge en attente de validation par un admin",
  VALIDE: "Badge hygiène validé",
  REFUSE: "Demande refusée, vous pouvez la soumettre à nouveau",
};

export const libellesCategorie: Record<string, string> = {
  CONFITURE: "Confiture",
  SIROP: "Sirop",
  CHUTNEY: "Chutney",
  FRUITS_SECS: "Fruits secs",
};

export const emojiCategorie: Record<string, string> = {
  CONFITURE: "🍯",
  SIROP: "🧃",
  CHUTNEY: "🥫",
  FRUITS_SECS: "🌰",
};

export const libellesModeRecolte: Record<string, string> = {
  DEJA_RECOLTE: "Déjà récoltés",
  A_RECOLTER_SOI_MEME: "À récolter soi-même",
};

export const libellesRaisonDemande: Record<string, string> = {
  TRANSFORMER_VENDRE: "Transformer et vendre",
  TRANSFORMER_CONSOMMER: "Transformer et consommer",
  CONSOMMER: "Consommer directement",
};

export const libellesSaison: Record<string, string> = {
  PRINTEMPS: "Printemps",
  ETE: "Été",
  AUTOMNE: "Automne",
  HIVER: "Hiver",
};

export const emojiSaison: Record<string, string> = {
  PRINTEMPS: "🌱",
  ETE: "☀️",
  AUTOMNE: "🍂",
  HIVER: "❄️",
};

export const libellesUnite: Record<string, string> = {
  KG: "kg",
  CAGETTE: "cagette(s)",
  AUTRE: "unité(s)",
};

export const libellesUrgence: Record<string, string> = {
  PAS_PRESSE: "Pas pressé",
  BIENTOT: "Bientôt",
  URGENT: "Urgent",
};

export const couleurUrgence: Record<string, string> = {
  PAS_PRESSE: "bg-kagette-feuille-50 text-kagette-feuille-600",
  BIENTOT: "bg-kagette-mangue-50 text-kagette-mangue-600",
  URGENT: "bg-kagette-framboise-50 text-kagette-framboise-600",
};
