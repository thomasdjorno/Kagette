# Kagette

Marketplace française qui relie donneurs de fruits de jardin, cuisiniers locaux
et acheteurs de confitures, sirops, chutneys et fruits secs faits maison.
Lancement pilote sur **Mensignac et alentours (Dordogne)**.

## État du projet

Développement par étapes validées une à une :

- [x] Étape 1 — Auth & modèle de données
- [x] Étape 2 — Annonces (fruits & produits transformés)
- [x] Étape 3 — Carte géolocalisée
- [x] Étape 4 — Paiement Stripe Connect (split 3 parts)
- [x] Étape 5 — Messagerie & avis
- [x] **Étape 6 — Backoffice admin** (ce commit) — toutes les étapes prévues sont livrées

## Lancer le projet en local

### Prérequis

- Node.js 20+
- Une base PostgreSQL locale (ou distante) — via Docker par exemple :

```bash
docker run --name kagette-db -e POSTGRES_USER=kagette -e POSTGRES_PASSWORD=kagette -e POSTGRES_DB=kagette -p 5432:5432 -d postgres:16
```

### Installation

```bash
npm install
cp .env.example .env
```

Remplis `.env` (`DATABASE_URL`, `AUTH_SECRET` généré via `openssl rand -base64 33`).
Les autres clés (Stripe, Mapbox, Resend, R2) ne sont nécessaires qu'à partir des
étapes correspondantes du projet.

### Base de données

```bash
npx prisma migrate dev --name init
npm run db:seed
```

Le seed crée :
- la région active **« Mensignac et alentours »** (centre ≈ Mensignac, rayon 15 km)
- la configuration de répartition par défaut (18 % donneur / 67 % cuisinier / 15 % commission)
- 12 comptes de test dispersés sur les communes autour de Mensignac (mot de passe
  `Kagette2026!` pour tous) :
  - `admin@kagette.fr` — admin
  - `marie.dupont@example.fr`, `sophie.lefevre@example.fr`, `bernard.petit@example.fr`,
    `henri.fabre@example.fr`, `pierre.lacombe@example.fr` — donneurs
  - `thomas.girard@example.fr`, `lucie.moreau@example.fr`, `isabelle.renard@example.fr`
    — cuisiniers, badge hygiène **validé**
  - `camille.rousseau@example.fr` — cumule donneuse **et** cuisinière (badge validé)
  - `nathalie.simon@example.fr` — a demandé le badge cuisinier, **en attente** de
    validation admin (casquette pas encore active — utile pour tester ce cas)
  - `marc.delattre@example.fr` — acheteur, aucune casquette
- 8 annonces de fruits et 8 produits transformés réalistes (avec traçabilité vers
  l'annonce de fruits d'origine pour la plupart), répartis sur Mensignac,
  Beauronne, Château-l'Évêque, Saint-Astier, La Chapelle-Gonaguet,
  Léguillac-de-Cercles, Douchapt, Vallereuil et Montagrier
- 2 commandes de démonstration (Marc achète chez Thomas et chez Isabelle),
  une déjà marquée « récupérée » avec un avis laissé, l'autre encore « payée »
  pour tester le parcours de bout en bout ; 2 conversations pré-remplies (une
  liée à une commande, une liée à une annonce de fruits) — utiles puisque
  Stripe n'étant pas configuré par défaut, c'est le seul moyen de tester
  messagerie et avis sans passer par un vrai paiement

Pour rejouer le seed sur une base déjà migrée : `npm run db:seed` (idempotent,
peut être relancé sans dupliquer les données).

### Lancer le serveur de dev

```bash
npm run dev
```

L'app est disponible sur http://localhost:3000. Tu peux te connecter avec les
comptes de test ou créer un nouveau compte via **Inscription**.

## Authentification

- Email + mot de passe (bcrypt, via Auth.js `Credentials`).
- Google OAuth : crée des identifiants sur
  [console.cloud.google.com](https://console.cloud.google.com/apis/credentials),
  URI de redirection autorisée : `http://localhost:3000/api/auth/callback/google`.
  Renseigne `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` dans `.env`.
- Un compte a deux « casquettes » indépendantes (`estDonneur`, `estCuisinier`),
  activables depuis `/profil`. La casquette cuisinier ne devient active
  (`estCuisinier = true`) qu'après validation manuelle du badge hygiène par un
  admin depuis `/admin/badges` (voir section Backoffice admin plus bas).

## Annonces

- `/fruits/nouveau` : réservé aux comptes avec la casquette donneur active.
- `/produits/nouveau` : réservé aux comptes avec la casquette cuisinier active
  (badge validé) ; le champ « fruits d'origine » permet de lier le produit à une
  annonce de fruits existante pour afficher la traçabilité sur la fiche produit.
- Les photos passent par une upload signée vers Cloudflare R2
  (`R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`,
  `R2_PUBLIC_URL` dans `.env`). Tant que ces variables ne sont pas renseignées,
  les formulaires restent utilisables **sans photo** (l'upload échoue proprement
  avec un message, la publication de l'annonce n'est pas bloquée).

## Carte géolocalisée

- La page d'accueil affiche une carte Mapbox GL centrée sur la région active,
  avec le cercle de son rayon de couverture, un marqueur vert 🍃 par annonce de
  fruits et un marqueur rose 🍯 par produit transformé (clic → popup avec lien
  vers la fiche). Si le navigateur autorise la géolocalisation, un point bleu
  indique la position de l'utilisateur.
- Nécessite un token public Mapbox dans `NEXT_PUBLIC_MAPBOX_TOKEN` (commence par
  `pk.`) — [account.mapbox.com/access-tokens](https://account.mapbox.com/access-tokens).
  Sans token (ou avec la valeur vide par défaut), la carte affiche un message
  explicatif à la place et le reste du site fonctionne normalement (liste des
  annonces en grille sous la carte).

## Configurer Stripe Connect en mode test

1. Crée un compte sur [dashboard.stripe.com](https://dashboard.stripe.com), reste en **mode test**.
2. Active **Connect** (Settings > Connect) et choisis le type de compte **Express**.
3. Récupère les clés de test (Developers > API keys) : `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`.
   `STRIPE_SECRET_KEY` doit commencer par `sk_` — tant qu'il est vide (ou invalide),
   les boutons « Acheter » et « Connecter mon compte Stripe » affichent un
   message clair au lieu de planter.
4. Pour le webhook en local, installe la [Stripe CLI](https://docs.stripe.com/stripe-cli) puis :
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
   La commande affiche un `whsec_...` à mettre dans `STRIPE_WEBHOOK_SECRET`.
5. **Onboarding des vendeurs** : depuis `/profil`, un donneur ou cuisinier clique
   sur « Connecter mon compte Stripe » → crée un compte Express
   (`stripe.accounts.create`) puis redirige vers l'onboarding hébergé par Stripe
   (Account Link). Au retour (`/api/stripe/connect/retour`), on vérifie
   `details_submitted` et on marque `stripeOnboardingComplete` sur le `User`.
   En mode test, l'onboarding Stripe peut être rempli avec les
   [données de test Stripe](https://docs.stripe.com/connect/testing) (numéros
   bidon acceptés).
6. **Achat** : sur une fiche produit, « Acheter » crée un `Order` (statut
   `EN_ATTENTE_PAIEMENT`) avec la répartition déjà calculée, puis une Stripe
   Checkout Session (mode `payment`). Au paiement réussi, le webhook
   `checkout.session.completed` crée un `Transfer` Stripe vers le cuisinier et,
   si le produit est tracé jusqu'à une annonce de fruits, un second vers le
   donneur — la commission plateforme n'est jamais transférée, elle reste sur
   le compte principal par construction.
7. Les pourcentages de répartition (défaut 18 % / 67 % / 15 %) sont stockés en
   base (`SplitConfig`, table à historique), jamais codés en dur — le
   backoffice admin ne couvre pas encore leur édition (hors périmètre du MVP,
   voir plus bas), donc pour les changer : `npx prisma studio` sur la table
   `SplitConfig`, désactiver l'ancienne ligne (`actif = false`) et en créer
   une nouvelle avec `actif = true`. Si un produit n'a pas de traçabilité vers
   une annonce de fruits, la part donneur revient au cuisinier (voir
   [`lib/payment-split.ts`](src/lib/payment-split.ts) et ses tests dans
   [`tests/payment-split.test.ts`](tests/payment-split.test.ts)).

## Messagerie & avis

- Un bouton « Contacter » sur chaque fiche fruits/produit (ou « Contacter le
  cuisinier »/« l'acheteur » depuis `/commandes` et `/ventes`) crée ou
  retrouve une conversation entre les deux parties concernées
  ([`lib/conversations.ts`](src/lib/conversations.ts)) et redirige vers
  `/messagerie/[id]`. Liste de toutes ses conversations sur `/messagerie`.
- Le statut d'une commande avance `PAYEE` → `PRETE_RETRAIT` (cuisinier,
  depuis `/ventes`) → `RECUPEREE` (acheteur ou cuisinier, depuis `/commandes`
  ou `/ventes`), via `/api/orders/[id]/statut`.
- Une fois la commande `RECUPEREE`, l'acheteur peut laisser un avis (note 1 à
  5 + commentaire) sur le cuisinier depuis `/commandes` — un seul avis par
  commande (contrainte unique sur `Review.orderId`). Les avis apparaissent sur
  la fiche produit du cuisinier, sa page de profil public, et (avis reçus par
  le donneur associé) sur la fiche de son annonce de fruits.

## Backoffice admin

Accessible sur `/admin` (lien « Backoffice » dans le header) pour tout compte
avec `estAdmin = true` — `admin@kagette.fr` dans le seed. Protégé par le
middleware (`src/middleware.ts`), redirection vers `/connexion` sinon.

- **`/admin/regions`** : crée une région (nom, latitude/longitude du centre,
  rayon en km — toujours inactive à la création) et bascule son statut
  actif/inactif. Aucune zone n'est jamais codée en dur dans la logique
  métier — l'ouverture progressive se fait uniquement via les lignes de la
  table `Region`. C'est ainsi qu'on active une nouvelle ville/région pour de
  vrai : créer la ligne ici, l'activer quand elle est prête.
- **`/admin/badges`** : liste les demandes de badge hygiène en attente
  (`hygieneBadgeStatus = EN_ATTENTE`) avec SIRET et date d'acceptation de la
  charte. « Valider » passe `estCuisinier` à `true` et le badge à `VALIDE` ;
  « Refuser » repasse à `REFUSE` sans activer la casquette.
- **`/admin/signalements`** : chaque fiche fruits/produit a un lien discret
  « Signaler cette annonce » (visible aux utilisateurs connectés,
  [`ReportButton`](src/components/moderation/ReportButton.tsx)) qui crée un
  `Report`. Depuis le backoffice, « Retirer l'annonce » passe le
  `FruitListing`/`ProductListing` visé en `ANNULE`/`ARCHIVE` et clôt le
  signalement ; « Rejeter » clôt le signalement sans toucher à l'annonce.

Si tu préfères l'accès direct à la base plutôt que l'UI, `npx prisma studio`
fonctionne toujours pour tout éditer à la main.

## Tests

```bash
npm test
```

La logique de répartition du paiement à 3 parts (donneur / cuisinier /
plateforme) sera couverte par des tests dédiés à partir de l'étape 4 — c'est
le calcul le plus critique du produit.
