import { describe, it, expect } from "vitest";
import {
  inscriptionSchema,
  fruitListingSchema,
  fruitRequestSchema,
  productListingSchema,
} from "@/lib/validation";

describe("inscriptionSchema", () => {
  it("accepte une inscription valide", () => {
    const r = inscriptionSchema.safeParse({
      prenom: "Marie",
      nom: "Dupont",
      email: "marie@example.fr",
      password: "motdepasse123",
    });
    expect(r.success).toBe(true);
  });

  it("rejette un mot de passe trop court", () => {
    const r = inscriptionSchema.safeParse({
      prenom: "Marie",
      nom: "Dupont",
      email: "marie@example.fr",
      password: "court",
    });
    expect(r.success).toBe(false);
  });

  it("rejette un email invalide", () => {
    const r = inscriptionSchema.safeParse({
      prenom: "Marie",
      nom: "Dupont",
      email: "pas-un-email",
      password: "motdepasse123",
    });
    expect(r.success).toBe(false);
  });
});

const fruitListingValide = {
  variete: "Pommes reinette",
  quantiteKg: 10,
  mode: "DON" as const,
  modeRecolte: "A_RECOLTER_SOI_MEME" as const,
  zoneRetrait: "Bourg de Mensignac",
  latitude: 45.17,
  longitude: 0.66,
  regionId: "region-1",
  disponibleDu: new Date("2026-09-01"),
  disponibleAu: new Date("2026-10-01"),
};

describe("fruitListingSchema", () => {
  it("accepte une annonce de don valide", () => {
    expect(fruitListingSchema.safeParse(fruitListingValide).success).toBe(true);
  });

  it("rejette une date de fin avant la date de début", () => {
    const r = fruitListingSchema.safeParse({
      ...fruitListingValide,
      disponibleDu: new Date("2026-10-01"),
      disponibleAu: new Date("2026-09-01"),
    });
    expect(r.success).toBe(false);
  });

  it("exige un montant de participation en mode participation libre", () => {
    const r = fruitListingSchema.safeParse({
      ...fruitListingValide,
      mode: "PARTICIPATION_LIBRE",
    });
    expect(r.success).toBe(false);
  });

  it("accepte le mode participation libre avec un montant fourni", () => {
    const r = fruitListingSchema.safeParse({
      ...fruitListingValide,
      mode: "PARTICIPATION_LIBRE",
      montantParticipation: 3,
    });
    expect(r.success).toBe(true);
  });

  it("rejette une quantité négative ou nulle", () => {
    expect(fruitListingSchema.safeParse({ ...fruitListingValide, quantiteKg: 0 }).success).toBe(
      false
    );
    expect(fruitListingSchema.safeParse({ ...fruitListingValide, quantiteKg: -5 }).success).toBe(
      false
    );
  });
});

describe("fruitRequestSchema", () => {
  it("accepte une demande valide", () => {
    const r = fruitRequestSchema.safeParse({
      fruitListingId: "listing-1",
      quantiteDemandeeKg: 3,
      raison: "CONSOMMER",
    });
    expect(r.success).toBe(true);
  });

  it("rejette une raison hors de l'énumération autorisée", () => {
    const r = fruitRequestSchema.safeParse({
      fruitListingId: "listing-1",
      quantiteDemandeeKg: 3,
      raison: "AUTRE_CHOSE",
    });
    expect(r.success).toBe(false);
  });

  it("rejette une quantité demandée négative ou nulle", () => {
    const r = fruitRequestSchema.safeParse({
      fruitListingId: "listing-1",
      quantiteDemandeeKg: 0,
      raison: "CONSOMMER",
    });
    expect(r.success).toBe(false);
  });
});

describe("productListingSchema", () => {
  const base = {
    titre: "Confiture de pommes",
    categorie: "CONFITURE" as const,
    description: "Une bonne confiture maison",
    dluo: new Date("2027-01-01"),
    prix: 5.5,
    quantiteDisponible: 10,
    zoneRetrait: "Mensignac",
    latitude: 45.17,
    longitude: 0.66,
    regionId: "region-1",
  };

  it("accepte un produit valide", () => {
    expect(productListingSchema.safeParse(base).success).toBe(true);
  });

  it("rejette un prix négatif ou nul", () => {
    expect(productListingSchema.safeParse({ ...base, prix: 0 }).success).toBe(false);
    expect(productListingSchema.safeParse({ ...base, prix: -1 }).success).toBe(false);
  });

  it("rejette une catégorie inconnue", () => {
    const r = productListingSchema.safeParse({ ...base, categorie: "AUTRE" });
    expect(r.success).toBe(false);
  });
});
