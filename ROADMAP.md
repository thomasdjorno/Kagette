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

- **Favoris / abonnements** *(vérifié)* : bouton "Suivre" sur le profil public
  d'un donneur ou cuisinier, page `/profil/favoris` pour gérer qui on suit,
  section "🔔 Nouveautés de tes favoris" mise en avant en haut de l'accueil
  avec les annonces récentes des personnes suivies
- **Emails transactionnels (Resend)** *(vérifié en mode dégradé)* :
  confirmation de commande, nouveau message reçu, badge hygiène
  validé/refusé, nouvelle demande de fruits reçue — sans clé Resend, les
  emails sont juste loggés côté serveur au lieu d'être envoyés (aucun
  plantage), testé en conditions réelles (requête API bout en bout)

- **Audit robustesse/sécurité** *(vérifié)* — passe non demandée mais faite
  "en coulisses" pour combler des trous qu'on ne voit pas de l'extérieur :
  - Upload photo : l'extension de fichier n'était plus prise depuis le
    client (risque d'écraser un fichier ailleurs sur le stockage) — dérivée
    du type MIME côté serveur à la place ; limite de 5 Mo par photo ajoutée
    (avant : aucune limite de taille)
  - Emails : le prénom, le titre d'annonce, etc. étaient insérés tels quels
    dans le HTML des emails — quelqu'un aurait pu glisser du code dans son
    prénom et l'injecter dans un email envoyé à un autre utilisateur ;
    toutes les valeurs sont maintenant échappées
  - Répartition des paiements (`SplitConfig`) éditable depuis le backoffice
    (`/admin/repartition`) — avant, seul Prisma Studio permettait de
    changer les pourcentages donneur/cuisinier/plateforme
  - Page d'admin protégée une seconde fois côté page (en plus du
    middleware) — pure précaution si jamais une route admin est ajoutée
    sans passer par le bon chemin
  - Limite de fréquence ajoutée là où il n'y en avait aucune : inscription,
    connexion, messages, demandes de fruits, signalements — évite qu'un
    compte ou un script spamme ces actions. *(en mémoire process, donc à
    revoir si l'app tourne un jour sur plusieurs serveurs en parallèle)*
  - Tests automatisés ajoutés pour les schémas de validation (inscription,
    annonces fruits/produits, demandes de fruits) et pour le nouveau
    limiteur de fréquence — 25 tests au total, tous passants

## 🔲 À faire

### Priorité moyenne (qualité / robustesse)
- [ ] Gestion des sessions "fantômes" ailleurs que `/profil` (pas
  bloquant : ces pages renvoient juste "aucune donnée" pour un compte
  fantôme au lieu de forcer une reconnexion, mais ce serait plus propre)

### Avant un vrai lancement (hors MVP mais à garder en tête)
- [ ] Pages légales (CGU, mentions légales, politique de confidentialité)
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
