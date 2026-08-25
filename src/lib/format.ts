export function formatPrix(montant: number | string) {
  const valeur = typeof montant === "string" ? parseFloat(montant) : montant;
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(valeur);
}

export function formatDistance(km: number) {
  if (km < 1) return `à ${Math.round(km * 1000)} m`;
  return `à ${km.toFixed(1).replace(".", ",")} km`;
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

export const dluoSuggereeMois: Record<string, number> = {
  CONFITURE: 12,
  SIROP: 6,
  CHUTNEY: 6,
  FRUITS_SECS: 6,
};

export function calculerDluoSuggeree(categorie: string, depuis: Date = new Date()): string {
  const mois = dluoSuggereeMois[categorie] ?? 6;
  const date = new Date(depuis);
  date.setMonth(date.getMonth() + mois);
  return date.toISOString().slice(0, 10);
}

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

export const libellesStatutDemande: Record<string, string> = {
  EN_ATTENTE: "En attente",
  ACCEPTEE: "Acceptée",
  REFUSEE: "Refusée",
};

export const couleurStatutDemande: Record<string, string> = {
  EN_ATTENTE: "bg-kagette-mangue-50 text-kagette-mangue-600",
  ACCEPTEE: "bg-kagette-feuille-50 text-kagette-feuille-600",
  REFUSEE: "bg-kagette-framboise-50 text-kagette-framboise-600",
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

export function fraicheurRecolte(
  disponibleDu: Date | string,
  disponibleAu: Date | string
): { texte: string; urgent: boolean } | null {
  const maintenant = new Date();
  const debut = typeof disponibleDu === "string" ? new Date(disponibleDu) : disponibleDu;
  const fin = typeof disponibleAu === "string" ? new Date(disponibleAu) : disponibleAu;

  if (maintenant < debut) {
    return { texte: `Récolte à partir du ${formatDate(debut)}`, urgent: false };
  }
  if (maintenant > fin) {
    return null;
  }

  const joursRestants = Math.ceil((fin.getTime() - maintenant.getTime()) / (1000 * 60 * 60 * 24));
  if (joursRestants <= 0) {
    return { texte: "Dernier jour pour passer !", urgent: true };
  }
  if (joursRestants === 1) {
    return { texte: "Encore 1 jour pour passer", urgent: true };
  }
  return { texte: `Encore ${joursRestants} jours pour passer`, urgent: joursRestants <= 3 };
}
