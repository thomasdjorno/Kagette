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
- **Pages légales** *(brouillon à valider — voir ci-dessous)* : Mentions
  légales, CGU et Politique de confidentialité créées et liées depuis un
  nouveau footer sur toutes les pages (`/mentions-legales`, `/cgu`,
  `/confidentialite`)
- **Guide du Kagetteur** *(vérifié)* : nouvelle section `/guide` avec 5
  articles pratiques — hygiène de base + charte Kagette, stérilisation des
  bocaux, étiquetage obligatoire (DLUO, allergènes, ingrédients...), cadre
  légal de la vente (occasionnelle vs micro-entreprise), conseils par
  type de produit (confitures/sirops/chutneys/fruits secs). Lié depuis le
  footer, le formulaire de création de produit, et la casquette cuisinier
  du profil
- **Page badge cuisinier** *(vérifié)* : nouvelle page `/profil/badge-cuisinier`
  qui explique ce qu'est le badge, pourquoi il rassure les acheteurs, et les
  étapes pour l'obtenir (lire la charte, vérifier son cadre légal, SIRET
  optionnel, accepter et envoyer) — la case à cocher pour accepter la
  charte pointe maintenant vers le vrai texte de la charte (`/guide/hygiene`)
  au lieu de faire référence à un document qui n'existait pas
- **DLUO et allergènes sur les produits** *(déjà en place, vérifié)* : ces
  champs existaient déjà dans le formulaire de création et sur la fiche
  produit — pas de nouveau développement nécessaire ici, juste vérifié que
  ça fonctionne et bien mis en avant dans le nouveau guide d'étiquetage
- **Design — avatar utilisateur** *(vérifié)* : photo de profil réelle
  (upload + affichage), avec repli propre sur des initiales colorées si pas
  de photo ou si l'image ne charge pas (corrige au passage un bug trouvé en
  testant : une photo Google OAuth aurait fait planter toute la page avant
  ce correctif). Visible dans le header, le profil, et les profils publics
- **Design — onboarding première visite** *(vérifié)* : nouvelle page
  `/bienvenue` juste après l'inscription, qui explique les 3 rôles
  (donneur/cuisinier/acheteur) et permet d'activer la casquette donneur ou
  de démarrer la demande de badge cuisinier directement
- **Design — états de chargement** *(vérifié)* : spinner de chargement
  Kagette affiché automatiquement pendant le chargement de n'importe quelle
  page (convention `loading.tsx` de Next.js)
- **Design — pages d'erreur personnalisées** *(vérifié)* : page 404
  ("Cette page s'est envolée") et page d'erreur générique aux couleurs
  Kagette, au lieu des écrans par défaut Next.js
- **Pagination sur l'accueil** *(vérifié)* : les grilles fruits/produits de
  la page d'accueil sont paginées (6 par page, navigation indépendante pour
  chaque section) — la carte continue d'afficher toutes les annonces, seule
  la liste est paginée
- **Recherche & filtre sur l'accueil** *(vérifié)* : barre de recherche
  (variété de fruit ou titre de produit) et filtre par catégorie de produit,
  combinables, avec bouton "Réinitialiser" quand un filtre est actif
- **Édition du profil** *(vérifié)* : prénom, nom et téléphone modifiables
  depuis `/profil` (le téléphone existait déjà en base mais n'avait aucune
  interface avant) — la photo se change juste au-dessus (avatar)
- **Suppression de compte** *(vérifié)* : "Zone dangereuse" dans le profil,
  confirmation par mot de passe + case à cocher. Techniquement c'est une
  anonymisation plutôt qu'une suppression physique (email/nom/photo/tél.
  effacés, casquettes désactivées, annonces actives retirées) car les
  commandes/avis/messages n'ont aucune règle de suppression en cascade en
  base — les supprimer physiquement casserait l'historique des autres
  utilisateurs. Politique de confidentialité mise à jour en conséquence
- **Mot de passe oublié** *(vérifié)* : lien "Mot de passe oublié ?" sur la
  page de connexion → email avec lien de réinitialisation valable 1h →
  nouveau mot de passe. Réponse volontairement identique que le compte
  existe ou non (anti-énumération de comptes), lien à usage unique (supprimé
  après utilisation) — testé de bout en bout avec un vrai token généré en
  base (email juste loggé en mode dégradé sans Resend, comme les autres)
- **Statut visible sur les demandes de fruits** *(vérifié)* : après avoir
  envoyé une demande, la personne voit maintenant clairement "Tes demandes
  sur cette annonce" avec le statut (en attente/acceptée/refusée) sur la
  fiche fruit elle-même — avant, la demande partait sans aucune confirmation
  visible
- **Page "Mes demandes"** *(vérifié)* : nouvelle page `/profil/demandes`
  listant tout l'historique des demandes de fruits d'un compte, avec filtre
  par statut (toutes/en attente/acceptée/refusée)
- **Connexion sur Netlify réparée** *(vérifié)* : ajout de `trustHost: true`
  dans la config Auth.js, nécessaire sur Netlify (contrairement à Vercel qui
  est auto-détecté) — sans ça, connexion et inscription échouaient
  silencieusement sur le site déployé
- **Provenance enrichie sur les produits** *(vérifié)* : le bloc "Origine"
  d'un produit affiche maintenant une vraie photo (celle de l'arbre si le
  donneur en a renseigné une dans son jardin, sinon celle de l'annonce de
  fruits) et l'avatar du donneur à côté de son nom, au lieu d'un simple
  emoji générique. Ajout aussi d'une liste d'ingrédients (nouveau champ,
  séparé des allergènes) et d'un intitulé "Description" plus visible
- **"Mes gains" pour les donneurs** *(vérifié)* : nouvelle page
  `/profil/gains` listant les commandes où les fruits d'un donneur ont
  servi, avec montant par commande, total cumulé, et statut du versement
  Stripe. Le cuisinier avait déjà "Mes ventes" avec ses propres montants,
  le donneur n'avait aucun équivalent
- **Boucle demande de fruits → création de produit** *(vérifié)* : sur
  "Mes demandes", une demande acceptée affiche maintenant "Créer un
  produit avec ces fruits →", qui ouvre le formulaire produit avec cette
  annonce de fruits pré-sélectionnée. Le formulaire met aussi en avant en
  premier ("Tes demandes acceptées") les fruits pour lesquels le cuisinier
  a déjà un accord, avant la liste complète des annonces de la région

- **5 fonctionnalités "premium"** *(vérifiées en live)* :
  - **Timeline "Du jardin à ton bocal"** : sur la fiche produit, le bloc
    "Origine" devient une vraie frise visuelle (🌳 arbre → 🧺 récolte →
    🍯 transformation), avec photo et avatar, plutôt qu'un simple bloc de
    texte
  - **Répartition en direct** : sur le formulaire de création de produit,
    dès que le prix est tapé, un encart affiche en temps réel "Tu
    recevras X€, le donneur Y€, Kagette Z€" — se recalcule aussi si on
    change les fruits d'origine
  - **Distance réelle sur les annonces** : "à 2,3 km" affiché directement
    sur chaque carte fruit/produit de l'accueil (calculé depuis la
    position du compte connecté, si elle est renseignée)
  - **Mode "Je cherche" pour les cuisiniers** : nouvelle section
    `/fruits/recherches` où un cuisinier publie ce qu'il recherche
    (variété, quantité, message), les donneurs la voient et peuvent le
    contacter directement. Nouveau modèle `FruitSearchRequest`, statut
    ouverte/comblée/annulée gérable par le cuisinier
  - **Décompte de fraîcheur** : sur les annonces de fruits, un badge
    dynamique ("Encore 3 jours pour passer") calculé depuis la vraie date
    de fin de disponibilité, avec mise en évidence si c'est urgent (≤3
    jours) — remplace l'idée initiale d'un badge statique, appliqué aux
    annonces de fruits qui ont de vraies dates (contrairement aux fiches
    arbre du jardin, qui n'ont qu'une saison et une urgence déclarées
    manuellement, sans date précise)

- **Recherche d'adresse au lieu de latitude/longitude à la main** *(vérifié)* :
  sur les deux formulaires de création (fruits et produits), on tape
  maintenant une adresse ou une commune ("Mensignac") et on choisit dans une
  liste de suggestions (Mapbox Geocoding) — les coordonnées se remplissent
  toutes seules en arrière-plan. Avant, il fallait taper des coordonnées GPS
  en décimal, un vrai frein pour un utilisateur non technique. Dégradation
  propre : si `NEXT_PUBLIC_MAPBOX_TOKEN` n'est pas configuré, les champs
  latitude/longitude manuels reviennent automatiquement

- **Cloche de notifications dans l'app** *(vérifiée en live)* : nouveau
  modèle `Notification`, une cloche dans le header (badge avec le nombre
  non lu, se rafraîchit toutes les 30s) prévient en direct : nouvelle
  demande de fruits reçue, demande acceptée/refusée, nouveau message,
  badge hygiène validé/refusé. Ça comble une partie du frein "aucun email
  ne part vraiment" (Resend non configuré) sans dépendre d'un service
  externe — testé de bout en bout (demande créée par un compte, notif
  reçue et cliquable par l'autre, marquage lu vérifié en base)

- **Badge de confiance visible** *(vérifié en live)* : au-delà des étoiles
  d'avis, chaque profil affiche un niveau ("👋 Nouveau membre", "🌱
  Kagetteur actif", "🤝 Kagetteur de confiance" à partir de 5 échanges,
  "🌟 Pilier de la communauté" à partir de 15) calculé depuis les vrais
  échanges terminés (commandes récupérées, demandes de fruits acceptées,
  côté donneur comme côté demandeur). Affiché sur le profil public, et à
  côté du nom du donneur/cuisinier sur les fiches fruits et produits

- **Récolte collective** *(vérifiée en live)* : un donneur avec beaucoup de
  fruits d'un coup peut organiser une journée de cueillette sur son annonce
  (date, nombre de places, précisions) ; les autres utilisateurs voient
  l'événement et cliquent "Je viens !" (avec limite de places si définie),
  le donneur reçoit une notification à chaque inscription et peut annuler
  l'événement. Nouveaux modèles `RecolteCollective` et
  `ParticipationRecolte` — testé de bout en bout (création par un compte,
  inscription par un autre, notification reçue, données vérifiées en base)

- **Générateur d'étiquettes avec QR code** *(vérifié en live)* : depuis sa
  fiche produit ou "Mes annonces", un cuisinier génère une étiquette
  imprimable (ingrédients, allergènes en gras, DLUO, nom du producteur) avec
  un QR code qui renvoie vers la fiche produit Kagette. Page réservée au
  propriétaire du produit (redirection sinon, vérifié), mise en page
  optimisée pour l'impression (header/footer masqués automatiquement à
  l'impression). Ancienne idée notée "pour plus tard", maintenant faite

- **DLUO suggérée automatiquement** *(vérifiée en live)* : sur le formulaire
  produit, la date de DLUO se pré-remplit selon la catégorie (confiture 12
  mois, sirop/chutney/fruits secs 6 mois), recalculée à chaque changement
  de catégorie tant que le cuisinier n'a pas modifié la date à la main
  (auquel cas son choix est respecté). Une note rappelle que c'est une
  suggestion à ajuster selon la recette, pas une garantie

- **Panier multi-produits** *(vérifié en live)* : un acheteur peut ajouter
  des produits de plusieurs cuisiniers différents dans un même panier
  (persisté en local sur son appareil), ajuster les quantités, retirer un
  article, puis payer en une seule fois. Une seule session Stripe Checkout
  est créée pour tout le panier ; chaque produit garde sa propre commande
  en base (split de paiement par vendeur inchangé), regroupées sous un même
  identifiant de panier pour n'afficher qu'une seule page de confirmation.
  Icône panier avec compteur dans le header, testé avec 2 produits de 2
  cuisiniers différents (total et quantités recalculés correctement)

- **Calendrier de saisonnalité** *(vérifié en live)* : page `/calendrier`
  listant 15 fruits typiques de Dordogne avec leur période de récolte,
  section "de saison en ce moment" mise en avant selon le mois en cours
  avec le nombre d'annonces disponibles pour chaque fruit (lien direct vers
  la recherche filtrée), et grille annuelle complète avec le mois courant
  surligné. Accessible depuis le header (desktop et menu mobile)

- **Suggestions complémentaires** *(vérifié en live)* : sur une fiche
  produit, deux sections optionnelles poussent à explorer plus loin —
  "Autres transformations des fruits de {donneur}" (autres produits issus
  du même fruit d'origine, même s'ils viennent d'un autre cuisinier) et
  "Autres créations de {cuisinier}" (le reste du catalogue du même
  cuisinier), sans doublon entre les deux. N'apparaît que s'il y a
  effectivement quelque chose à suggérer

- **QR code de partage sur le profil** *(vérifié en live)* : sur `/profil`,
  un QR code renvoie directement vers son profil public, avec un bouton
  "Copier le lien" et une carte imprimable dédiée (`/profil/carte`, nom +
  casquettes + QR) à afficher au marché ou sur son portail pour que les
  voisins retrouvent facilement ses annonces sur Kagette. Réutilise le
  générateur de QR code déjà en place pour les étiquettes produit

- **Tableau d'impact** *(vérifié en live)* : deux pages complémentaires.
  `/impact` (publique) affiche les chiffres de toute la communauté (kg de
  fruits sauvés du gaspillage, nombre de donneurs/cuisiniers/acheteurs
  actifs, produits créés, échanges réalisés, équivalent CO2 évité en km
  voiture — estimation clairement annoncée comme telle) ainsi qu'une
  "chaîne locale en action" listant qui a donné quoi, transformé par qui,
  acheté par combien de personnes. `/profil/impact` fait la même chose à
  l'échelle personnelle, section par section selon les casquettes actives
  (donneur / cuisinier / acheteur), avec la chaîne nominative de chaque
  transaction ("Tu as acheté X de {cuisinier}, avec les fruits de
  {donneur}") : l'objectif explicite était de créer du lien concret entre
  les trois parties, pas juste des statistiques abstraites. Testé avec 3
  comptes aux profils différents (donneur seul, cuisinier+donneur,
  acheteur) — chiffres et chaînes vérifiés exacts par recoupement SQL

## 🔲 À faire

### Priorité moyenne (qualité / robustesse)
- [ ] Gestion des sessions "fantômes" ailleurs que `/profil` (pas
  bloquant : ces pages renvoient juste "aucune donnée" pour un compte
  fantôme au lieu de forcer une reconnexion, mais ce serait plus propre)

### ⚠️ Avant un vrai lancement — pages légales à compléter
Les 3 pages légales sont rédigées avec un contenu réel pour tout ce que
l'app fait déjà (rôles, répartition des paiements, données collectées),
mais contiennent des champs entre crochets `[...]` que **toi seul** peux
remplir (tu es le seul à connaître ton statut juridique réel) :
- `/mentions-legales` : nom/raison sociale, forme juridique, adresse,
  SIRET, email de contact, nom de l'hébergeur définitif
- `/confidentialite` : email de contact RGPD, durée de conservation des
  données
- Avant un vrai lancement commercial, fais relire ces 3 pages par un
  professionnel (avocat ou service en ligne type Legalstart/Captain
  Contrat) — ce que j'ai écrit décrit fidèlement le fonctionnement de
  l'app mais n'a pas de valeur de conseil juridique
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

(rien pour l'instant)
