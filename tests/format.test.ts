import { describe, it, expect } from "vitest";
import { fraicheurRecolte, calculerDluoSuggeree, formatDateInput } from "@/lib/format";

describe("formatDateInput", () => {
  it("formate une date en YYYY-MM-DD à partir des getters locaux", () => {
    expect(formatDateInput(new Date(2026, 0, 5))).toBe("2026-01-05");
  });

  it("ajoute bien les zéros de tête pour le mois et le jour", () => {
    expect(formatDateInput(new Date(2026, 8, 9))).toBe("2026-09-09");
  });
});

describe("fraicheurRecolte", () => {
  it("annonce une récolte à venir si la fenêtre commence dans le futur", () => {
    const debut = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
    const fin = new Date(Date.now() + 20 * 24 * 60 * 60 * 1000);
    const r = fraicheurRecolte(debut, fin);
    expect(r).not.toBeNull();
    expect(r?.urgent).toBe(false);
    expect(r?.texte).toContain("Récolte à partir du");
  });

  it("renvoie null si la fenêtre de récolte est déjà terminée", () => {
    const debut = new Date(Date.now() - 20 * 24 * 60 * 60 * 1000);
    const fin = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000);
    expect(fraicheurRecolte(debut, fin)).toBeNull();
  });

  it("marque comme urgent et affiche 'dernier jour' quand aujourd'hui est le dernier jour de la fenêtre", () => {
    const debut = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);
    const fin = new Date(); // aujourd'hui, même si l'heure exacte a déjà un peu avancé
    const r = fraicheurRecolte(debut, fin);
    expect(r?.urgent).toBe(true);
    expect(r?.texte).toBe("Dernier jour pour passer !");
  });

  it("reste disponible toute la journée du dernier jour, même en fin de journée (pas de coupure à minuit)", () => {
    const debut = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);
    const finJournee = new Date();
    finJournee.setHours(23, 59, 59, 999);
    const r = fraicheurRecolte(debut, finJournee);
    expect(r).not.toBeNull();
    expect(r?.urgent).toBe(true);
  });

  it("marque comme urgent quand il reste 3 jours ou moins, pas au-delà", () => {
    const debut = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);
    const dansTroisJours = fraicheurRecolte(debut, new Date(Date.now() + 3 * 24 * 60 * 60 * 1000));
    const dansQuatreJours = fraicheurRecolte(debut, new Date(Date.now() + 4 * 24 * 60 * 60 * 1000));
    expect(dansTroisJours?.urgent).toBe(true);
    expect(dansQuatreJours?.urgent).toBe(false);
  });
});

describe("calculerDluoSuggeree", () => {
  it("suggère 12 mois pour une confiture", () => {
    const depuis = new Date("2026-01-15");
    expect(calculerDluoSuggeree("CONFITURE", depuis)).toBe("2027-01-15");
  });

  it("suggère 6 mois pour un sirop, un chutney ou des fruits secs", () => {
    const depuis = new Date("2026-01-15");
    expect(calculerDluoSuggeree("SIROP", depuis)).toBe("2026-07-15");
    expect(calculerDluoSuggeree("CHUTNEY", depuis)).toBe("2026-07-15");
    expect(calculerDluoSuggeree("FRUITS_SECS", depuis)).toBe("2026-07-15");
  });

  it("retombe sur 6 mois par défaut pour une catégorie inconnue", () => {
    const depuis = new Date("2026-01-15");
    expect(calculerDluoSuggeree("AUTRE", depuis)).toBe("2026-07-15");
  });
});
