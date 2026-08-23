import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const MOT_DE_PASSE_DEMO = "Kagette2026!";

async function main() {
  // Zone pilote : Mensignac et ses alentours (Dordogne). Le rayon couvre les
  // communes voisines (Beauronne, Château-l'Évêque, Saint-Astier...), pas
  // uniquement le bourg de Mensignac — la population y est dispersée, pas
  // concentrée sur une seule ville.
  const regionMensignac = await prisma.region.upsert({
    where: { id: "region-mensignac" },
    update: {},
    create: {
      id: "region-mensignac",
      nom: "Mensignac et alentours",
      isActive: true,
      latitude: 45.1719,
      longitude: 0.6667,
      rayonKm: 15,
    },
  });

  await prisma.splitConfig.upsert({
    where: { id: "split-config-default" },
    update: {},
    create: {
      id: "split-config-default",
      donneurPercent: 18,
      cuisinierPercent: 67,
      commissionPercent: 15,
      actif: true,
    },
  });

  const motDePasseHash = await bcrypt.hash(MOT_DE_PASSE_DEMO, 10);

  // ─────────────────────── Comptes ───────────────────────

  await prisma.user.upsert({
    where: { email: "admin@kagette.fr" },
    update: {},
    create: {
      email: "admin@kagette.fr",
      password: motDePasseHash,
      prenom: "Admin",
      nom: "Kagette",
      estAdmin: true,
    },
  });

  const marie = await prisma.user.upsert({
    where: { email: "marie.dupont@example.fr" },
    update: {},
    create: {
      email: "marie.dupont@example.fr",
      password: motDePasseHash,
      prenom: "Marie",
      nom: "Dupont",
      estDonneur: true,
      latitude: 45.1719,
      longitude: 0.6667,
    },
  });

  const sophie = await prisma.user.upsert({
    where: { email: "sophie.lefevre@example.fr" },
    update: {},
    create: {
      id: "user-sophie",
      email: "sophie.lefevre@example.fr",
      password: motDePasseHash,
      prenom: "Sophie",
      nom: "Lefèvre",
      estDonneur: true,
      latitude: 45.215,
      longitude: 0.66,
    },
  });

  const thomas = await prisma.user.upsert({
    where: { email: "thomas.girard@example.fr" },
    update: {},
    create: {
      id: "user-thomas",
      email: "thomas.girard@example.fr",
      password: motDePasseHash,
      prenom: "Thomas",
      nom: "Girard",
      estCuisinier: true,
      siret: "82345678900012",
      charteHygieneAccepteeLe: new Date("2026-06-01"),
      hygieneBadgeStatus: "VALIDE",
      hygieneBadgeValideLe: new Date("2026-06-05"),
      latitude: 45.1719,
      longitude: 0.6667,
    },
  });

  const camille = await prisma.user.upsert({
    where: { email: "camille.rousseau@example.fr" },
    update: {},
    create: {
      id: "user-camille",
      email: "camille.rousseau@example.fr",
      password: motDePasseHash,
      prenom: "Camille",
      nom: "Rousseau",
      estDonneur: true,
      estCuisinier: true,
      siret: "79123456700018",
      charteHygieneAccepteeLe: new Date("2026-05-20"),
      hygieneBadgeStatus: "VALIDE",
      hygieneBadgeValideLe: new Date("2026-05-25"),
      latitude: 45.145,
      longitude: 0.535,
    },
  });

  const bernard = await prisma.user.upsert({
    where: { email: "bernard.petit@example.fr" },
    update: {},
    create: {
      id: "user-bernard",
      email: "bernard.petit@example.fr",
      password: motDePasseHash,
      prenom: "Bernard",
      nom: "Petit",
      estDonneur: true,
      latitude: 45.195,
      longitude: 0.605,
    },
  });

  const lucie = await prisma.user.upsert({
    where: { email: "lucie.moreau@example.fr" },
    update: {},
    create: {
      id: "user-lucie",
      email: "lucie.moreau@example.fr",
      password: motDePasseHash,
      prenom: "Lucie",
      nom: "Moreau",
      estCuisinier: true,
      siret: "85234567800014",
      charteHygieneAccepteeLe: new Date("2026-04-10"),
      hygieneBadgeStatus: "VALIDE",
      hygieneBadgeValideLe: new Date("2026-04-15"),
      latitude: 45.185,
      longitude: 0.575,
    },
  });

  const henri = await prisma.user.upsert({
    where: { email: "henri.fabre@example.fr" },
    update: {},
    create: {
      id: "user-henri",
      email: "henri.fabre@example.fr",
      password: motDePasseHash,
      prenom: "Henri",
      nom: "Fabre",
      estDonneur: true,
      latitude: 45.255,
      longitude: 0.61,
    },
  });

  await prisma.user.upsert({
    where: { email: "nathalie.simon@example.fr" },
    update: {},
    create: {
      id: "user-nathalie",
      email: "nathalie.simon@example.fr",
      password: motDePasseHash,
      prenom: "Nathalie",
      nom: "Simon",
      siret: "77012345600011",
      charteHygieneAccepteeLe: new Date("2026-08-10"),
      hygieneBadgeStatus: "EN_ATTENTE",
      latitude: 45.225,
      longitude: 0.625,
    },
  });

  const pierre = await prisma.user.upsert({
    where: { email: "pierre.lacombe@example.fr" },
    update: {},
    create: {
      id: "user-pierre",
      email: "pierre.lacombe@example.fr",
      password: motDePasseHash,
      prenom: "Pierre",
      nom: "Lacombe",
      estDonneur: true,
      latitude: 45.245,
      longitude: 0.685,
    },
  });

  const isabelle = await prisma.user.upsert({
    where: { email: "isabelle.renard@example.fr" },
    update: {},
    create: {
      id: "user-isabelle",
      email: "isabelle.renard@example.fr",
      password: motDePasseHash,
      prenom: "Isabelle",
      nom: "Renard",
      estCuisinier: true,
      siret: "81345678900015",
      charteHygieneAccepteeLe: new Date("2026-03-15"),
      hygieneBadgeStatus: "VALIDE",
      hygieneBadgeValideLe: new Date("2026-03-20"),
      latitude: 45.295,
      longitude: 0.585,
    },
  });

  await prisma.user.upsert({
    where: { email: "marc.delattre@example.fr" },
    update: {},
    create: {
      id: "user-marc",
      email: "marc.delattre@example.fr",
      password: motDePasseHash,
      prenom: "Marc",
      nom: "Delattre",
      latitude: 45.235,
      longitude: 0.56,
    },
  });

  // ─────────────────────── Annonces fruits ───────────────────────

  const fruitPommesMarie = await prisma.fruitListing.upsert({
    where: { id: "fruit-pommes-marie" },
    update: {},
    create: {
      id: "fruit-pommes-marie",
      donneurId: marie.id,
      variete: "Pommes reinette",
      photoUrls: ["/seed-images/pommes.jpg"],
      quantiteEstimee: "environ 15 kg",
      quantiteKg: 15,
      modeRecolte: "A_RECOLTER_SOI_MEME",
      mode: "DON",
      description:
        "Un vieux pommier de reinettes au fond du jardin, plus assez de monde à la maison pour tout manger avant qu'elles ne tombent.",
      zoneRetrait: "Bourg de Mensignac, devant la mairie",
      latitude: 45.1719,
      longitude: 0.6667,
      regionId: regionMensignac.id,
      statut: "DISPONIBLE",
      disponibleDu: new Date("2026-09-15"),
      disponibleAu: new Date("2026-10-15"),
    },
  });

  const fruitFiguesSophie = await prisma.fruitListing.upsert({
    where: { id: "fruit-figues-sophie" },
    update: {},
    create: {
      id: "fruit-figues-sophie",
      donneurId: sophie.id,
      variete: "Figues violettes",
      photoUrls: ["/seed-images/figues.jpg"],
      quantiteEstimee: "environ 6 kg",
      quantiteKg: 6,
      modeRecolte: "A_RECOLTER_SOI_MEME",
      mode: "PARTICIPATION_LIBRE",
      montantParticipation: 5,
      description:
        "Figuier généreux cette année, les figues mûrissent vite en ce moment — à venir chercher rapidement.",
      zoneRetrait: "Château-l'Évêque, près de l'église",
      latitude: 45.215,
      longitude: 0.66,
      regionId: regionMensignac.id,
      statut: "DISPONIBLE",
      disponibleDu: new Date("2026-08-20"),
      disponibleAu: new Date("2026-09-10"),
    },
  });

  const fruitPoiresSophie = await prisma.fruitListing.upsert({
    where: { id: "fruit-poires-sophie" },
    update: {},
    create: {
      id: "fruit-poires-sophie",
      donneurId: sophie.id,
      variete: "Poires williams",
      photoUrls: ["/seed-images/poires.jpg"],
      quantiteEstimee: "environ 10 kg",
      quantiteKg: 10,
      modeRecolte: "A_RECOLTER_SOI_MEME",
      mode: "PARTICIPATION_LIBRE",
      montantParticipation: 2,
      description: "Poirier planté par mon grand-père, très productif chaque année.",
      zoneRetrait: "Château-l'Évêque, près de l'église",
      latitude: 45.215,
      longitude: 0.66,
      regionId: regionMensignac.id,
      statut: "DISPONIBLE",
      disponibleDu: new Date("2026-09-05"),
      disponibleAu: new Date("2026-09-25"),
    },
  });

  const fruitNoixBernard = await prisma.fruitListing.upsert({
    where: { id: "fruit-noix-bernard" },
    update: {},
    create: {
      id: "fruit-noix-bernard",
      donneurId: bernard.id,
      variete: "Noix",
      photoUrls: ["/seed-images/noix.jpg"],
      quantiteEstimee: "environ 20 kg",
      quantiteKg: 20,
      modeRecolte: "DEJA_RECOLTE",
      mode: "DON",
      description: "Deux noyers dans le pré, largement de quoi partager après la récolte.",
      zoneRetrait: "La Chapelle-Gonaguet, hameau du Breuil",
      latitude: 45.195,
      longitude: 0.605,
      regionId: regionMensignac.id,
      statut: "DISPONIBLE",
      disponibleDu: new Date("2026-10-01"),
      disponibleAu: new Date("2026-10-31"),
    },
  });

  const fruitPrunesHenri = await prisma.fruitListing.upsert({
    where: { id: "fruit-prunes-henri" },
    update: {},
    create: {
      id: "fruit-prunes-henri",
      donneurId: henri.id,
      variete: "Prunes reine-claude",
      photoUrls: ["/seed-images/prunes.jpg"],
      quantiteEstimee: "environ 8 kg",
      quantiteKg: 8,
      modeRecolte: "A_RECOLTER_SOI_MEME",
      mode: "PARTICIPATION_LIBRE",
      montantParticipation: 3,
      description: "Prunier en pleine forme, les fruits sont bien sucrés cette année.",
      zoneRetrait: "Léguillac-de-Cercles, le bourg",
      latitude: 45.255,
      longitude: 0.61,
      regionId: regionMensignac.id,
      statut: "DISPONIBLE",
      disponibleDu: new Date("2026-08-15"),
      disponibleAu: new Date("2026-09-05"),
    },
  });

  const fruitNoisettesHenri = await prisma.fruitListing.upsert({
    where: { id: "fruit-noisettes-henri" },
    update: {},
    create: {
      id: "fruit-noisettes-henri",
      donneurId: henri.id,
      variete: "Noisettes",
      photoUrls: ["/seed-images/noisettes.jpg"],
      quantiteEstimee: "environ 5 kg",
      quantiteKg: 5,
      modeRecolte: "A_RECOLTER_SOI_MEME",
      mode: "DON",
      description: "Une haie de noisetiers le long du chemin, à récolter avant les écureuils !",
      zoneRetrait: "Léguillac-de-Cercles, le bourg",
      latitude: 45.255,
      longitude: 0.61,
      regionId: regionMensignac.id,
      statut: "DISPONIBLE",
      disponibleDu: new Date("2026-09-01"),
      disponibleAu: new Date("2026-09-20"),
    },
  });

  const fruitCoingsPierre = await prisma.fruitListing.upsert({
    where: { id: "fruit-coings-pierre" },
    update: {},
    create: {
      id: "fruit-coings-pierre",
      donneurId: pierre.id,
      variete: "Coings",
      photoUrls: ["/seed-images/coings.jpg"],
      quantiteEstimee: "environ 12 kg",
      quantiteKg: 12,
      modeRecolte: "A_RECOLTER_SOI_MEME",
      mode: "DON",
      description: "Cognassier isolé au bout du terrain, personne ne les ramasse d'habitude.",
      zoneRetrait: "Douchapt, lieu-dit les Vergnes",
      latitude: 45.245,
      longitude: 0.685,
      regionId: regionMensignac.id,
      statut: "DISPONIBLE",
      disponibleDu: new Date("2026-10-10"),
      disponibleAu: new Date("2026-11-15"),
    },
  });

  const fruitMirabellesCamille = await prisma.fruitListing.upsert({
    where: { id: "fruit-mirabelles-camille" },
    update: {},
    create: {
      id: "fruit-mirabelles-camille",
      donneurId: camille.id,
      variete: "Mirabelles",
      photoUrls: ["/seed-images/mirabelles.jpg"],
      quantiteEstimee: "environ 7 kg",
      quantiteKg: 7,
      modeRecolte: "A_RECOLTER_SOI_MEME",
      mode: "PARTICIPATION_LIBRE",
      montantParticipation: 4,
      description: "Mirabellier du jardin, récolte abondante — je garde une partie pour mes propres chutneys.",
      zoneRetrait: "Saint-Astier, quartier de la gare",
      latitude: 45.145,
      longitude: 0.535,
      regionId: regionMensignac.id,
      statut: "DISPONIBLE",
      disponibleDu: new Date("2026-08-10"),
      disponibleAu: new Date("2026-08-31"),
    },
  });

  // ─────────────────────── Annonces produits transformés ───────────────────────

  await prisma.productListing.upsert({
    where: { id: "produit-confiture-pommes-thomas" },
    update: {},
    create: {
      id: "produit-confiture-pommes-thomas",
      cuisinierId: thomas.id,
      fruitListingOrigineId: fruitPommesMarie.id,
      titre: "Confiture de pommes reinette",
      categorie: "CONFITURE",
      description:
        "Confiture cuite au chaudron, peu sucrée, avec une pointe de vanille. Faite avec les pommes du jardin de Marie à Mensignac.",
      photoUrls: ["/seed-images/confiture-pommes.jpg"],
      allergenes: [],
      dluo: new Date("2027-10-15"),
      prix: 5.5,
      quantiteDisponible: 12,
      zoneRetrait: "Mensignac, marché du samedi",
      latitude: 45.1719,
      longitude: 0.6667,
      regionId: regionMensignac.id,
      statut: "EN_VENTE",
    },
  });

  await prisma.productListing.upsert({
    where: { id: "produit-sirop-figues-thomas" },
    update: {},
    create: {
      id: "produit-sirop-figues-thomas",
      cuisinierId: thomas.id,
      fruitListingOrigineId: fruitFiguesSophie.id,
      titre: "Sirop de figue maison",
      categorie: "SIROP",
      description:
        "Sirop artisanal préparé à partir des figues violettes du jardin de Sophie à Château-l'Évêque. Parfait pour l'eau pétillante ou les yaourts.",
      photoUrls: ["/seed-images/sirop-figue.jpg"],
      allergenes: [],
      dluo: new Date("2027-09-10"),
      prix: 7,
      quantiteDisponible: 8,
      zoneRetrait: "Mensignac, marché du samedi",
      latitude: 45.1719,
      longitude: 0.6667,
      regionId: regionMensignac.id,
      statut: "EN_VENTE",
    },
  });

  await prisma.productListing.upsert({
    where: { id: "produit-chutney-prune-camille" },
    update: {},
    create: {
      id: "produit-chutney-prune-camille",
      cuisinierId: camille.id,
      fruitListingOrigineId: fruitPrunesHenri.id,
      titre: "Chutney prune-gingembre",
      categorie: "CHUTNEY",
      description:
        "Un chutney relevé au gingembre frais, à base des prunes reine-claude d'Henri à Léguillac-de-Cercles. Parfait avec un fromage de chèvre.",
      photoUrls: ["/seed-images/chutney-prune.jpg"],
      allergenes: ["moutarde"],
      dluo: new Date("2027-03-05"),
      prix: 5.9,
      quantiteDisponible: 10,
      zoneRetrait: "Saint-Astier, quartier de la gare",
      latitude: 45.145,
      longitude: 0.535,
      regionId: regionMensignac.id,
      statut: "EN_VENTE",
    },
  });

  await prisma.productListing.upsert({
    where: { id: "produit-mirabelles-sechees-camille" },
    update: {},
    create: {
      id: "produit-mirabelles-sechees-camille",
      cuisinierId: camille.id,
      fruitListingOrigineId: fruitMirabellesCamille.id,
      titre: "Mirabelles séchées",
      categorie: "FRUITS_SECS",
      description:
        "Mirabelles de mon propre jardin, séchées doucement au déshydrateur. Idéales dans un muesli ou pour grignoter.",
      photoUrls: ["/seed-images/mirabelles-sechees.jpg"],
      allergenes: ["sulfites"],
      dluo: new Date("2027-02-28"),
      prix: 8.5,
      quantiteDisponible: 15,
      zoneRetrait: "Saint-Astier, quartier de la gare",
      latitude: 45.145,
      longitude: 0.535,
      regionId: regionMensignac.id,
      statut: "EN_VENTE",
    },
  });

  await prisma.productListing.upsert({
    where: { id: "produit-sirop-coing-lucie" },
    update: {},
    create: {
      id: "produit-sirop-coing-lucie",
      cuisinierId: lucie.id,
      fruitListingOrigineId: fruitCoingsPierre.id,
      titre: "Sirop de coing",
      categorie: "SIROP",
      description:
        "Sirop délicat préparé avec les coings du jardin de Pierre à Douchapt, sans arômes ajoutés.",
      photoUrls: ["/seed-images/sirop-coing.jpg"],
      allergenes: [],
      dluo: new Date("2027-11-15"),
      prix: 6.5,
      quantiteDisponible: 9,
      zoneRetrait: "Vallereuil, place du village",
      latitude: 45.185,
      longitude: 0.575,
      regionId: regionMensignac.id,
      statut: "EN_VENTE",
    },
  });

  await prisma.productListing.upsert({
    where: { id: "produit-confiture-noix-miel-lucie" },
    update: {},
    create: {
      id: "produit-confiture-noix-miel-lucie",
      cuisinierId: lucie.id,
      fruitListingOrigineId: fruitNoixBernard.id,
      titre: "Confiture noix-miel",
      categorie: "CONFITURE",
      description:
        "Une confiture originale à base des noix de Bernard à La Chapelle-Gonaguet et de miel local.",
      photoUrls: ["/seed-images/confiture-noix-miel.jpg"],
      allergenes: ["fruits à coque"],
      dluo: new Date("2027-10-31"),
      prix: 6.9,
      quantiteDisponible: 7,
      zoneRetrait: "Vallereuil, place du village",
      latitude: 45.185,
      longitude: 0.575,
      regionId: regionMensignac.id,
      statut: "EN_VENTE",
    },
  });

  await prisma.productListing.upsert({
    where: { id: "produit-chutney-noisette-isabelle" },
    update: {},
    create: {
      id: "produit-chutney-noisette-isabelle",
      cuisinierId: isabelle.id,
      fruitListingOrigineId: fruitNoisettesHenri.id,
      titre: "Chutney noisette-pomme",
      categorie: "CHUTNEY",
      description:
        "Un chutney automnal aux noisettes d'Henri et pommes locales, parfait avec une viande blanche.",
      photoUrls: ["/seed-images/chutney-noisette.jpg"],
      allergenes: ["fruits à coque"],
      dluo: new Date("2027-09-20"),
      prix: 5.5,
      quantiteDisponible: 11,
      zoneRetrait: "Montagrier, bord de Dronne",
      latitude: 45.295,
      longitude: 0.585,
      regionId: regionMensignac.id,
      statut: "EN_VENTE",
    },
  });

  await prisma.productListing.upsert({
    where: { id: "produit-assortiment-fruits-secs-isabelle" },
    update: {},
    create: {
      id: "produit-assortiment-fruits-secs-isabelle",
      cuisinierId: isabelle.id,
      fruitListingOrigineId: null,
      titre: "Assortiment de fruits secs du jardin",
      categorie: "FRUITS_SECS",
      description:
        "Un assortiment de fruits séchés selon les récoltes de la saison — pommes, poires et prunes selon arrivage.",
      photoUrls: ["/seed-images/fruits-secs-assortiment.jpg"],
      allergenes: ["fruits à coque", "sulfites"],
      dluo: new Date("2027-01-15"),
      prix: 9,
      quantiteDisponible: 6,
      zoneRetrait: "Montagrier, bord de Dronne",
      latitude: 45.295,
      longitude: 0.585,
      regionId: regionMensignac.id,
      statut: "EN_VENTE",
    },
  });

  // ─────────────────────── Commandes, avis & messagerie ───────────────────────
  // Stripe n'étant pas configuré dans cet environnement de démo, ces commandes
  // sont insérées directement pour permettre de tester messagerie et avis.

  await prisma.order.upsert({
    where: { id: "order-marc-confiture-pommes" },
    update: {},
    create: {
      id: "order-marc-confiture-pommes",
      acheteurId: "user-marc",
      productListingId: "produit-confiture-pommes-thomas",
      quantite: 1,
      montantTotal: 5.5,
      montantDonneur: 0.99,
      montantCuisinier: 3.68,
      montantPlateforme: 0.83,
      statut: "RECUPEREE",
      stripePaymentIntentId: "pi_seed_demo_1",
      stripeTransferCuisinierId: "tr_seed_demo_1",
      stripeTransferDonneurId: "tr_seed_demo_2",
    },
  });

  await prisma.review.upsert({
    where: { orderId: "order-marc-confiture-pommes" },
    update: {},
    create: {
      orderId: "order-marc-confiture-pommes",
      auteurId: "user-marc",
      cibleId: thomas.id,
      note: 5,
      commentaire: "Délicieuse confiture, exactement comme annoncé, merci Thomas !",
    },
  });

  await prisma.order.upsert({
    where: { id: "order-marc-chutney-noisette" },
    update: {},
    create: {
      id: "order-marc-chutney-noisette",
      acheteurId: "user-marc",
      productListingId: "produit-chutney-noisette-isabelle",
      quantite: 1,
      montantTotal: 5.5,
      montantDonneur: 0.99,
      montantCuisinier: 3.68,
      montantPlateforme: 0.83,
      statut: "PAYEE",
      stripePaymentIntentId: "pi_seed_demo_3",
    },
  });

  await prisma.conversation.upsert({
    where: { id: "conv-marc-thomas-commande" },
    update: {},
    create: {
      id: "conv-marc-thomas-commande",
      orderId: "order-marc-confiture-pommes",
      participants: { create: [{ userId: "user-marc" }, { userId: thomas.id }] },
      messages: {
        create: [
          {
            auteurId: "user-marc",
            contenu: "Bonjour, je viens d'acheter la confiture de pommes, quand puis-je passer la récupérer ?",
          },
          {
            auteurId: thomas.id,
            contenu: "Bonjour Marc ! Je suis au marché de Mensignac tous les samedis matin, à partir de 9h.",
          },
          {
            auteurId: "user-marc",
            contenu: "Parfait, j'y serai ce samedi, merci !",
          },
        ],
      },
    },
  });

  await prisma.conversation.upsert({
    where: { id: "conv-camille-henri-prunes" },
    update: {},
    create: {
      id: "conv-camille-henri-prunes",
      fruitListingId: fruitPrunesHenri.id,
      participants: { create: [{ userId: camille.id }, { userId: henri.id }] },
      messages: {
        create: [
          {
            auteurId: camille.id,
            contenu: "Bonjour Henri, tes prunes reine-claude m'intéressent pour un chutney, il en reste ?",
          },
          {
            auteurId: henri.id,
            contenu: "Oui largement, passe quand tu veux à Léguillac-de-Cercles cette semaine.",
          },
        ],
      },
    },
  });

  // ─────────────────────── Signalement de démonstration ───────────────────────

  await prisma.report.upsert({
    where: { id: "report-demo-assortiment" },
    update: {},
    create: {
      id: "report-demo-assortiment",
      reporterId: "user-marc",
      targetType: "PRODUCT_LISTING",
      productListingId: "produit-assortiment-fruits-secs-isabelle",
      motif: "L'annonce ne précise pas la liste exacte des fruits secs présents dans le sachet.",
      statut: "EN_ATTENTE",
    },
  });

  console.log(`Seed terminé — région active : ${regionMensignac.nom}`);
  console.log(`Mot de passe pour tous les comptes de démo : ${MOT_DE_PASSE_DEMO}`);
  console.log("Comptes :");
  console.log("  - admin@kagette.fr (admin)");
  console.log("  - marie.dupont@example.fr (donneuse)");
  console.log("  - sophie.lefevre@example.fr (donneuse)");
  console.log("  - thomas.girard@example.fr (cuisinier, badge validé)");
  console.log("  - camille.rousseau@example.fr (donneuse + cuisinière, badge validé)");
  console.log("  - bernard.petit@example.fr (donneur)");
  console.log("  - lucie.moreau@example.fr (cuisinière, badge validé)");
  console.log("  - henri.fabre@example.fr (donneur)");
  console.log("  - nathalie.simon@example.fr (badge cuisinier en attente)");
  console.log("  - pierre.lacombe@example.fr (donneur)");
  console.log("  - isabelle.renard@example.fr (cuisinière, badge validé)");
  console.log("  - marc.delattre@example.fr (acheteur, sans casquette)");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
