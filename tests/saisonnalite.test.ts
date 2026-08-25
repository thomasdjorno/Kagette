import { describe, it, expect } from "vitest";
import { fruitsDeSaison, periodeTexte, fruitsSaisonDordogne } from "@/lib/saisonnalite";

describe("periodeTexte", () => {
  it("formate une période classique dans l'année", () => {
    expect(periodeTexte([8, 9])).toBe("août - septembre");
  });

  it("formate un seul mois sans tiret", () => {
    expect(periodeTexte([7])).toBe("juillet");
  });

  it("formate une période qui traverse le changement d'année (kiwi : nov-jan)", () => {
    expect(periodeTexte([11, 12, 1])).toBe("novembre - janvier");
  });

  it("renvoie une chaîne vide pour une liste de mois vide", () => {
    expect(periodeTexte([])).toBe("");
  });
});

describe("fruitsDeSaison", () => {
  it("retourne uniquement les fruits dont le mois demandé fait partie de la saison", () => {
    const enAout = fruitsDeSaison(8);
    expect(enAout.map((f) => f.nom)).toContain("Prune");
    expect(enAout.map((f) => f.nom)).not.toContain("Fraise");
  });

  it("inclut le kiwi en janvier malgré le passage d'année dans sa liste de mois", () => {
    const enJanvier = fruitsDeSaison(1);
    expect(enJanvier.map((f) => f.nom)).toContain("Kiwi");
  });

  it("ne renvoie aucun fruit pour un mois où rien n'est de saison dans la liste fournie", () => {
    const vide = fruitsDeSaison(6, []);
    expect(vide).toEqual([]);
  });

  it("l'été (juin à septembre) a toujours au moins un fruit de saison dans la liste par défaut", () => {
    for (const mois of [6, 7, 8, 9]) {
      expect(fruitsDeSaison(mois, fruitsSaisonDordogne).length).toBeGreaterThan(0);
    }
  });
});
