/**
 * Limiteur en mémoire (par process). Suffisant pour un pilote sur une seule
 * instance ; à remplacer par un limiteur partagé (Upstash Redis, etc.) si
 * l'app tourne un jour sur plusieurs instances serverless.
 */
const compteurs = new Map<string, { count: number; resetAt: number }>();

export function verifierLimite(cle: string, maxRequetes: number, fenetreMs: number): boolean {
  const maintenant = Date.now();
  const compteur = compteurs.get(cle);

  if (!compteur || maintenant > compteur.resetAt) {
    compteurs.set(cle, { count: 1, resetAt: maintenant + fenetreMs });
    return true;
  }

  if (compteur.count >= maxRequetes) return false;

  compteur.count += 1;
  return true;
}

export function ipDepuisRequete(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "inconnu";
}
