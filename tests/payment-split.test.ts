import { describe, it, expect } from "vitest";
import { calculerRepartition, type Pourcentages } from "@/lib/payment-split";

const defaut: Pourcentages = {
  donneurPercent: 18,
  cuisinierPercent: 67,
  commissionPercent: 15,
};

describe("calculerRepartition", () => {
  it("répartit 10€ selon 18/67/15 avec un donneur identifié", () => {
    const r = calculerRepartition(10, defaut, true);
    expect(r.montantDonneur).toBeCloseTo(1.8, 5);
    expect(r.montantCuisinier).toBeCloseTo(6.7, 5);
    expect(r.montantPlateforme).toBeCloseTo(1.5, 5);
    expect(r.montantTotal).toBe(10);
  });

  it("ne verse rien au donneur si le produit n'a pas de traçabilité, le cuisinier récupère sa part", () => {
    const r = calculerRepartition(10, defaut, false);
    expect(r.montantDonneur).toBe(0);
    expect(r.montantCuisinier).toBeCloseTo(8.5, 5);
    expect(r.montantPlateforme).toBeCloseTo(1.5, 5);
  });

  it("la commission plateforme est identique avec ou sans donneur (calculée sur le total, pas sur le reste)", () => {
    const avecDonneur = calculerRepartition(10, defaut, true);
    const sansDonneur = calculerRepartition(10, defaut, false);
    expect(avecDonneur.montantPlateforme).toBe(sansDonneur.montantPlateforme);
  });

  it("la somme des 3 parts est toujours exactement égale au total, y compris avec des arrondis délicats", () => {
    const montants = [0.01, 0.03, 0.99, 1, 4.99, 5.5, 7.77, 12.34, 99.99, 1000.01];
    for (const montant of montants) {
      for (const aUnDonneur of [true, false]) {
        const r = calculerRepartition(montant, defaut, aUnDonneur);
        const somme = Math.round((r.montantDonneur + r.montantCuisinier + r.montantPlateforme) * 100);
        expect(somme).toBe(Math.round(r.montantTotal * 100));
      }
    }
  });

  it("ne produit jamais de part négative pour des pourcentages réalistes", () => {
    const montants = [0.01, 0.02, 0.05, 1, 3.33, 250];
    for (const montant of montants) {
      for (const aUnDonneur of [true, false]) {
        const r = calculerRepartition(montant, defaut, aUnDonneur);
        expect(r.montantDonneur).toBeGreaterThanOrEqual(0);
        expect(r.montantCuisinier).toBeGreaterThanOrEqual(0);
        expect(r.montantPlateforme).toBeGreaterThanOrEqual(0);
      }
    }
  });

  it("fonctionne avec des pourcentages personnalisés (config modifiée depuis le backoffice)", () => {
    const custom: Pourcentages = { donneurPercent: 20, cuisinierPercent: 60, commissionPercent: 20 };
    const r = calculerRepartition(50, custom, true);
    expect(r.montantDonneur).toBeCloseTo(10, 5);
    expect(r.montantCuisinier).toBeCloseTo(30, 5);
    expect(r.montantPlateforme).toBeCloseTo(10, 5);
  });

  it("gère un montant d'un centime sans erreur d'arrondi", () => {
    const r = calculerRepartition(0.01, defaut, true);
    const somme = Math.round((r.montantDonneur + r.montantCuisinier + r.montantPlateforme) * 100);
    expect(somme).toBe(1);
  });
});
