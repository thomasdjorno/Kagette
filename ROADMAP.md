# Roadmap Kagette

Suivi de ce qui est fait, ce qu'il reste à faire, et des services externes à
connecter. On avance module par module — coche au fur et à mesure.

## ✅ Déjà fait

- **Auth & modèle de données** : email/mdp + Google OAuth (config prête),
  casquettes donneur/cuisinier, badge hygiène
- **Annonces** : création/consultation fruits & produits transformés,
  traçabilité produit ↔ fruit d'origine, photos (upload R2 + 16 photos de
  démo réalistes en attendant), grille 3 colonnes
- **Carte géolocalisée** : Mapbox GL, cercle de rayon de région, marqueurs
  fruits/produits (fonctionne en mode dégradé sans token)
- **Paiement Stripe Connect** : onboarding Express, checkout, split 3 parts
  (donneur/cuisinier/plateforme), tests unitaires sur le calcul
- **Messagerie & avis** : conversations liées à une annonce/commande, avis
  post-transaction
- **Backoffice admin** : régions (créer/activer/désactiver), validation
  badges hygiène, modération des signalements
- **Design** : palette beige/marron/vert sapin, logo + mascotte intégrés,
  header responsive, style "marketplace" (Vinted-like)
- **Demandes de quantité sur les annonces fruits** *(vérifié)* : quantité en
  kg, statut déjà récolté / à récolter soi-même, un intéressé peut demander
  une quantité précise avec une raison (transformer & vendre / transformer &
  consommer / consommer), le donneur accepte ou refuse
- **Jardin & fiches par arbre** *(vérifié)* : un donneur organise son jardin
  en fiches par arbre (variété, saison, quantité en kg/cagette/autre, déjà
  récolté ou à récolter soi-même, urgence de récolte) — visible sur son
  profil public, et réutilisable pour préremplir une annonce de fruits
- **"Mes annonces"** *(vérifié)* : page `/profil/annonces` listant les
  annonces fruits et produits d'un compte, avec possibilité de changer le
  statut soi-même (remettre disponible, marquer terminée, annuler / rupture,
  archiver) sans passer par la modération admin — verrouillée si l'annonce
  est signalée
- **Passage mobile** *(vérifié)* : menu hamburger pour Messagerie / Mon
  profil / Mes annonces / Backoffice / Déconnexion (avant invisibles sur
  petit écran), grille d'annonces à 3 colonnes sur mobile avec cartes
  compactes, bannière d'accueil raccourcie (mascotte à côté des boutons au
  lieu d'en dessous) — vérifié aussi sur jardin, formulaires de création,
  commandes/ventes et backoffice (vue d'ensemble + régions)

## 🔲 À faire

### Priorité haute (fonctionnel, manque encore)
- [ ] **Emails transactionnels (Resend)** : rien n'est câblé côté code
  aujourd'hui. À prévoir a minima : confirmation de commande, nouveau
  message reçu, badge hygiène validé/refusé, nouvelle demande de fruits
  reçue

### Priorité moyenne (qualité / robustesse)
- [ ] Gestion des sessions "fantômes" (si la base est réinitialisée, forcer
  une reconnexion propre plutôt que planter) — corrigé sur `/profil`, à
  vérifier ailleurs si le cas se reproduit
- [ ] Tests automatisés au-delà du calcul de répartition (auth, annonces,
  demandes de fruits)
- [ ] Édition des pourcentages de répartition (`SplitConfig`) depuis le
  backoffice — aujourd'hui modifiable seulement via Prisma Studio
- [ ] Passage mobile de toutes les pages (fait : accueil/header ; à
  vérifier : backoffice, formulaires de création, commandes/ventes)

### Avant un vrai lancement (hors MVP mais à garder en tête)
- [ ] Pages légales (CGU, mentions légales, politique de confidentialité)
- [ ] Protection anti-spam sur les formulaires publics (inscription,
  signalement, messagerie)
- [ ] Hébergement de production (voir section API ci-dessous)

## 🔑 Services externes à connecter (quand tu seras prêt)

Rien de bloquant aujourd'hui — l'app se dégrade proprement partout tant que
ces clés sont absentes (messages clairs à la place de plantages). À faire
d'un coup quand tu veux tester le parcours réel de bout en bout :

| Service | Variables `.env` | Sert à | Où l'obtenir |
|---|---|---|---|
| **Mapbox** | `NEXT_PUBLIC_MAPBOX_TOKEN` | Carte des annonces sur l'accueil | account.mapbox.com/access-tokens |
| **Stripe Connect** | `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET` | Paiement + split 3 parts + onboarding vendeurs | dashboard.stripe.com (mode test) |
| **Google OAuth** | `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` | Connexion "avec Google" | console.cloud.google.com/apis/credentials |
| **Cloudflare R2** | `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL` | Upload de vraies photos sur les annonces | dash.cloudflare.com → R2 |
| **Resend** | `RESEND_API_KEY`, `RESEND_FROM_EMAIL` | Emails transactionnels (à câbler côté code, voir liste ci-dessus) | resend.com/api-keys |
| **Base de données prod** | `DATABASE_URL` | Remplace le Postgres local pour la mise en ligne | Neon, Railway, ou équivalent |
| **Hébergement** | — | Déployer le site en ligne | Vercel (recommandé pour Next.js) |

Détails de configuration pas à pas déjà écrits dans le [README](README.md).

## 💡 Idées notées pour plus tard

- **Générateur d'étiquettes** : un outil avec des templates aux couleurs et
  au logo Kagette, pour que les cuisiniers impriment des étiquettes pour
  leurs bocaux/produits (peut aussi servir à afficher proprement les mentions
  obligatoires : allergènes, DLUO, nom du producteur — déjà en base).
