import { z } from "zod";

export const inscriptionSchema = z.object({
  prenom: z.string().min(1, "Le prénom est requis"),
  nom: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "8 caractères minimum"),
});

export const demandeCuisinierSchema = z.object({
  siret: z
    .string()
    .trim()
    .regex(/^\d{14}$/, "Le SIRET doit contenir 14 chiffres")
    .optional()
    .or(z.literal("")),
  charteAcceptee: z.literal(true, {
    errorMap: () => ({ message: "Vous devez accepter la charte hygiène" }),
  }),
});

export const fruitListingSchema = z
  .object({
    variete: z.string().min(1, "La variété est requise"),
    quantiteKg: z.coerce.number().positive("Indique une quantité en kg"),
    mode: z.enum(["DON", "PARTICIPATION_LIBRE"]),
    montantParticipation: z.coerce.number().positive().optional(),
    modeRecolte: z.enum(["DEJA_RECOLTE", "A_RECOLTER_SOI_MEME"]),
    description: z.string().max(2000).optional().or(z.literal("")),
    zoneRetrait: z.string().min(1, "Le lieu de retrait est requis"),
    latitude: z.coerce.number().min(-90).max(90),
    longitude: z.coerce.number().min(-180).max(180),
    regionId: z.string().min(1),
    disponibleDu: z.coerce.date(),
    disponibleAu: z.coerce.date(),
    photoUrls: z.array(z.string().url()).max(6).default([]),
    arbreId: z.string().optional().or(z.literal("")),
  })
  .refine((data) => data.disponibleAu >= data.disponibleDu, {
    message: "La date de fin doit être après la date de début",
    path: ["disponibleAu"],
  })
  .refine((data) => data.mode !== "PARTICIPATION_LIBRE" || data.montantParticipation !== undefined, {
    message: "Indique un montant de participation",
    path: ["montantParticipation"],
  });

export const productCategories = ["CONFITURE", "SIROP", "CHUTNEY", "FRUITS_SECS"] as const;

export const productListingSchema = z.object({
  titre: z.string().min(1, "Le titre est requis"),
  categorie: z.enum(productCategories),
  description: z.string().min(1, "La description est requise").max(2000),
  ingredients: z.array(z.string()).default([]),
  allergenes: z.array(z.string()).default([]),
  dluo: z.coerce.date(),
  prix: z.coerce.number().positive("Le prix doit être positif"),
  quantiteDisponible: z.coerce.number().int().nonnegative(),
  zoneRetrait: z.string().min(1, "Le lieu de retrait est requis"),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  regionId: z.string().min(1),
  fruitListingOrigineId: z.string().optional().or(z.literal("")),
  photoUrls: z.array(z.string().url()).max(6).default([]),
});

export const raisonsDemande = ["TRANSFORMER_VENDRE", "TRANSFORMER_CONSOMMER", "CONSOMMER"] as const;

export const fruitRequestSchema = z.object({
  fruitListingId: z.string().min(1),
  quantiteDemandeeKg: z.coerce.number().positive("Indique une quantité en kg"),
  raison: z.enum(raisonsDemande),
  message: z.string().max(500).optional().or(z.literal("")),
});

export const fruitSearchRequestSchema = z.object({
  variete: z.string().min(1, "Indique quel fruit tu recherches"),
  quantiteSouhaiteeKg: z.coerce.number().positive().optional(),
  message: z.string().max(500).optional().or(z.literal("")),
  regionId: z.string().min(1),
});

export const recolteCollectiveSchema = z.object({
  fruitListingId: z.string().min(1),
  dateEvenement: z.coerce.date(),
  placesMax: z.coerce.number().int().positive().optional(),
  notes: z.string().max(500).optional().or(z.literal("")),
});

export const panierCheckoutSchema = z.object({
  items: z
    .array(
      z.object({
        productListingId: z.string().min(1),
        quantite: z.coerce.number().int().positive(),
      })
    )
    .min(1, "Le panier est vide"),
});

export const saisons = ["PRINTEMPS", "ETE", "AUTOMNE", "HIVER"] as const;
export const unitesQuantite = ["KG", "CAGETTE", "AUTRE"] as const;
export const urgencesRecolte = ["PAS_PRESSE", "BIENTOT", "URGENT"] as const;
export const modesRecolte = ["A_RECOLTER_SOI_MEME", "DEJA_RECOLTE"] as const;

export const modifierProfilSchema = z.object({
  prenom: z.string().min(1, "Le prénom est requis").optional(),
  nom: z.string().min(1, "Le nom est requis").optional(),
  telephone: z.string().max(20).optional().or(z.literal("")),
  photoUrl: z.string().url().optional().or(z.literal("")),
});

export const arbreSchema = z.object({
  variete: z.string().min(1, "La variété est requise"),
  saison: z.enum(saisons),
  quantite: z.coerce.number().positive("Indique une quantité"),
  unite: z.enum(unitesQuantite),
  modeRecolte: z.enum(modesRecolte),
  urgenceRecolte: z.enum(urgencesRecolte),
  photoUrl: z.string().url().optional().or(z.literal("")),
  notes: z.string().max(500).optional().or(z.literal("")),
});
