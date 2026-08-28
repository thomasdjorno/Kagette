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
- **Emails transactionnels (Resend)** *(vérifié en live, Resend branché en
  local)* : confirmation de commande, nouveau message reçu, badge hygiène
  validé/refusé, nouvelle demande de badge (admin), nouvelle recherche de
  fruits acceptée. Se dégrade toujours proprement (juste loggé côté
  serveur) si la clé venait à manquer
  - Sans domaine vérifié sur Resend, impossible d'envoyer à n'importe qui
    (l'API refuse avec une 403) : `RESEND_TEST_REDIRECT_TO` redirige
    temporairement tous les emails vers une seule adresse (le vrai
    destinataire reste visible dans le sujet, ex. `[à marc@...] Sujet`) —
    à retirer du `.env` une fois un domaine vérifié. Bug corrigé au
    passage : le SDK Resend renvoie ses erreurs de validation dans la
    réponse plutôt que de lever une exception, `envoyerEmail` ne les
    vérifiait pas et un échec d'envoi passait inaperçu (loggé "succès"
    alors que l'email n'était jamais parti)

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

- **Audit de cohérence + 2 bugs corrigés** : passage complet des liens
  internes (aucun lien mort), du menu mobile et de la doc. À l'occasion,
  deux vrais bugs trouvés en écrivant des tests et corrigés :
  - `fraicheurRecolte` traitait le dernier jour de récolte comme déjà
    expiré dès 00h01 (comparaison par instant exact au lieu de jour
    calendaire) — une annonce disparaissait un jour trop tôt
  - `calculerDluoSuggeree` pouvait suggérer une DLUO décalée d'un jour
    autour d'un changement d'heure été/hiver (conversion via
    `toISOString`/UTC au lieu de rester en heure locale)
  - Menu mobile (☰) : remplacé la liste de texte par une grille
    d'icônes, ajouté les raccourcis manquants "Mes achats" et "Mes
    ventes" (ce dernier réservé aux cuisiniers)
  - Tableau des services externes remis à jour (Mapbox, base de données
    de prod et hébergement étaient déjà branchés mais encore listés
    comme "à faire")
  - Nouveaux tests unitaires : `periodeTexte`, `fruitsDeSaison`,
    `fraicheurRecolte`, `calculerDluoSuggeree`, `distanceKm`,
    `kgFruitsVersCo2`/`co2VersKmVoiture` (23 tests, suite passée de 25 à
    48)

- **Suppression des "casquettes" à activer** *(vérifié en live)* : donner
  des fruits ou publier un produit ne demandait pas vraiment d'approbation
  côté donneur (juste un interrupteur sans porte réelle derrière), et côté
  cuisinier le vrai verrou était déjà le badge hygiène — la case à cocher
  "casquette cuisinier" était une pré-étape redondante. Changement : tout
  le monde peut proposer des fruits ou tenter de publier un produit à tout
  moment, sans rien activer au préalable :
  - `estDonneur` n'est plus un interrupteur manuel : il passe à `true`
    automatiquement dès la première annonce de fruits publiée (purement
    déclaratif, sert juste au badge "🌱 Donneur" affiché ailleurs)
  - `estCuisinier` ne change pas de mécanisme (toujours activé uniquement
    par la validation admin du badge hygiène), mais son message de blocage
    sur `/produits/nouveau` explique maintenant directement le vrai
    prérequis (badge hygiène) avec un lien direct vers la demande, au lieu
    de renvoyer vers "active ta casquette depuis ton profil"
  - Supprimé : le composant `DonneurToggle`, sa route API, et tous les
    verrous `estDonneur`/`estCuisinier` qui bloquaient l'accès à
    `/fruits/nouveau`, `/profil/jardin`, la création d'arbres et la
    connexion Stripe
  - Menu mobile et page `/profil` : "Mes gains", "Mes ventes", "Mes
    annonces" etc. sont maintenant toujours visibles (avant filtrés par
    rôle), section Paiements toujours affichée
  - Testé avec un compte n'ayant activé aucun rôle : accès direct à
    `/fruits/nouveau`, publication réussie, `estDonneur` bien passé à
    `true` en base, badge "Mes ventes"/"Mes gains" visibles dans le menu
    mobile dès avant toute activité

- **Panier accessible aux invités** *(vérifié en live)* : un visiteur non
  connecté voit maintenant directement le produit et le bouton "Ajouter au
  panier" au lieu d'un mur "Connecte-toi pour acheter" — la connexion n'est
  demandée qu'au moment de payer (`/panier`), pas avant. Testé : ajout au
  panier en étant déconnecté, produit bien présent dans `/panier`, message
  "Se connecter pour payer" affiché seulement au moment de passer commande

- **Notification admin sur une nouvelle demande de badge** *(vérifié en
  live)* : le badge hygiène étant désormais le seul vrai verrou pour
  vendre, un admin est notifié (in-app + email dès que Resend sera
  branché) dès qu'un cuisinier envoie sa demande, au lieu de devoir penser
  à vérifier le backoffice — réduit le délai avant qu'un cuisinier bloqué
  puisse vendre. Testé : demande envoyée par un compte test, notification
  bien créée pour l'admin avec le lien `/admin/badges`, tentative d'email
  bien loggée (Resend pas encore branché)

- **Alerte de disponibilité** *(vérifié en live)* : sur l'accueil, quand
  une recherche de produit (mot-clé et/ou catégorie) ne donne aucun
  résultat, un acheteur peut demander à être prévenu dès qu'une annonce
  correspondante sera publiée, au lieu de devoir revenir vérifier
  manuellement. Se déclenche une seule fois (in-app, email dès que Resend
  sera branché), gérable depuis `/profil` (liste des alertes actives +
  annulation). Testé de bout en bout : recherche "myrtille" sans résultat
  → alerte créée → publication d'un produit "Confiture de myrtille" par un
  autre compte → notification bien reçue avec le lien direct vers le
  produit, alerte marquée comme déclenchée en base

- **Moins de champs à remplir pour la première annonce** *(vérifié en
  live)* : sur les formulaires fruits et produits, le "Lieu de retrait"
  se pré-remplit automatiquement depuis l'adresse choisie dans la
  recherche Mapbox (reste modifiable pour préciser un repère), au lieu de
  redemander la même information deux fois. "Disponible du" et
  "Disponible au" ont maintenant des dates par défaut sensées
  (aujourd'hui → +14 jours) au lieu de champs vides à remplir à la main.
  Nouvelle fonction `formatDateInput` (testée) pour éviter le même bug de
  fuseau horaire que celui corrigé sur la DLUO

- **Barre de navigation simplifiée et harmonisée mobile/desktop**
  *(vérifié en live)* : le header desktop empilait 5 liens texte + cloche
  + panier + avatar + nom + bouton déconnexion sur une seule ligne.
  `MobileNav` (menu ☰ mobile uniquement) devient `NavMenu`, utilisé
  maintenant sur mobile ET desktop : l'avatar remplace le hamburger et
  déclenche la même grille d'icônes, ce qui absorbe aussi "Bonjour
  {prénom}" et le bouton "Déconnexion" (déjà dans le menu). Reste apparent
  en permanence dans la barre : logo, "Calendrier" (accès public), cloche,
  panier, avatar. "Calendrier" ajouté aussi dans la grille pour rester
  atteignable sur mobile où le lien texte est caché

- **Bug corrigé : header mobile illisible pour un visiteur non connecté**
  *(vérifié en live)* : le logo mobile était centré en position absolue,
  ce qui fonctionnait tant que le contenu à droite restait étroit (panier
  + avatar). Pour un invité, les boutons "Connexion"/"S'inscrire"
  recouvraient complètement le logo (mesuré : logo 94-281px, boutons
  98-359px sur un écran de 375px). Le logo mobile (mascotte + texte) est
  maintenant en flux normal à gauche, plus jamais en position absolue,
  donc plus jamais de recouvrement possible quel que soit le contenu à
  droite. Sur mobile, l'invité voit un seul lien compact "Connexion" (au
  lieu des deux boutons, qui ne rentraient pas) ; "S'inscrire" reste
  accessible via un nouveau lien croisé ajouté sur les pages
  `/connexion` ↔ `/inscription` (qui ne se renvoyaient à aucun moment
  l'une vers l'autre auparavant)

- **Icône et manifest PWA** *(vérifié en live)* : "Ajouter à l'écran
  d'accueil" affiche maintenant le bon nom ("Kagette") et une vraie icône
  carrée (la mascotte recadrée sur fond crème de la marque) au lieu de
  l'icône générique du navigateur — `manifest.json`, favicon,
  apple-touch-icon (iOS) et icônes Android (standard + maskable, 192/512px)
  générés depuis `public/mascotte/mascotte.png`. Couleur de thème
  (#2C4F3E) appliquée à la barre du navigateur mobile

- **Recherches de fruits ouvertes à tout le monde** *(vérifié en live)* :
  publier une recherche ("il me manque des noix") était réservé aux
  cuisiniers au badge validé — un reste de l'ancien modèle de rôles, sans
  vraie raison de sécurité (contrairement à la vente, demander du fruit ne
  présente aucun risque). N'importe quel compte connecté peut maintenant
  publier une recherche. Textes de la page dégenrés ("cuisiniers" →
  neutre). Testé avec un compte donneur (non cuisinier) : formulaire
  visible, publication réussie

- **Doublon du calendrier dans le header mobile retiré** *(vérifié en
  live)* : l'icône 📅 apparaissait à la fois en haut de l'écran et dans le
  menu (avatar) pour un compte connecté. Retirée du haut sur mobile
  uniquement pour les comptes connectés (le menu suffit) ; gardée pour les
  invités, qui n'ont pas ce menu

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
  SIRET, nom de l'hébergeur définitif (email de contact déjà rempli :
  contact.kagette@gmail.com)
- `/confidentialite` : durée de conservation des données (email de contact
  RGPD déjà rempli)
- Avant un vrai lancement commercial, fais relire ces 3 pages par un
  professionnel (avocat ou service en ligne type Legalstart/Captain
  Contrat) — ce que j'ai écrit décrit fidèlement le fonctionnement de
  l'app mais n'a pas de valeur de conseil juridique

## ✅ Déjà connectés (production)

- **Mapbox** (`NEXT_PUBLIC_MAPBOX_TOKEN`) — carte + recherche d'adresse en
  ligne
- **Base de données de production** — Neon Postgres, migrations déployées
  au fil de l'eau
- **Hébergement** — Netlify (`kagette.netlify.app`), déploiement continu
  depuis `main`
- **Cloudflare R2** — bucket `kagette` avec accès public (sous-domaine
  r2.dev) + policy CORS pour les uploads directs depuis le navigateur
  (localhost + kagette.netlify.app). Testé de bout en bout en local (upload
  réel via le formulaire, lecture publique, suppression) — **à répliquer
  sur Netlify** : ajouter les 5 variables `R2_*` dans Site configuration →
  Environment variables, puis redéployer
- **Resend** — clé API active, expéditeur temporaire `onboarding@resend.dev`
  (pas encore de domaine vérifié : à basculer sur une adresse
  `@tondomaine.fr` dès que tu en as un). Tous les emails déjà câblés en
  mode dégradé se déclenchent maintenant pour de vrai : confirmation de
  commande, badge hygiène validé/refusé, nouvelle demande de badge
  (admin), nouvelle recherche de fruits acceptée. Testé en local (envoi
  réel confirmé par l'API Resend + déclenché via le vrai parcours demande
  de badge, aucune erreur) — **à répliquer sur Netlify** : ajouter
  `RESEND_API_KEY` et `RESEND_FROM_EMAIL` dans Site configuration →
  Environment variables, puis redéployer

## 🔑 Services externes en cours de connexion

- **Stripe Connect** — clé secrète + webhook signing secret (mode test)
  configurés en local, testé directement en connexion API (compte "Kagette"
  atteint, balance récupérée). Webhook pointé vers
  `https://kagette.netlify.app/api/stripe/webhook` (événement
  `checkout.session.completed`) — **à répliquer sur Netlify** :
  `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`,
  puis tester un vrai achat de bout en bout (carte test) une fois déployé
- **Google OAuth** — en cours de configuration (écran de consentement +
  identifiants sur console.cloud.google.com, contact
  contact.kagette@gmail.com). Comme Kagette n'a pas encore de nom de
  domaine à lui (seulement `kagette.netlify.app`), Google ne permet pas de
  publier l'appli en "production" ouverte à tous pour l'instant — la
  connexion Google restera limitée aux comptes ajoutés comme testeurs
  jusqu'à l'achat d'un domaine

Détails de configuration pas à pas déjà écrits dans le [README](README.md).

## 💡 Idées notées pour plus tard

(rien pour l'instant)
