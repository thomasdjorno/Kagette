export const metadata = { title: "Politique de confidentialité, Kagette" };

export default function ConfidentialitePage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="font-serif text-2xl font-bold text-kagette-prune-700">
        Politique de confidentialité
      </h1>

      <div className="rounded-xl border border-kagette-mangue-300 bg-kagette-mangue-50 p-4 text-sm text-kagette-prune-700">
        ⚠️ Cette page décrit les données réellement collectées par
        l&apos;application aujourd&apos;hui. Les champs entre crochets (contact, durée de
        conservation) sont à définir avant un vrai lancement, idéalement avec l&apos;aide
        d&apos;un professionnel pour la conformité RGPD complète.
      </div>

      <section className="space-y-2 text-sm text-kagette-prune-700/80">
        <h2 className="font-semibold text-kagette-prune-700">Données collectées</h2>
        <p>Selon ton usage de Kagette, nous collectons :</p>
        <ul className="list-inside list-disc space-y-1">
          <li>Prénom, nom, email et mot de passe (chiffré, jamais lisible en clair)</li>
          <li>Localisation approximative (latitude/longitude) pour situer tes annonces sur la carte</li>
          <li>Numéro de téléphone, si tu choisis de le renseigner</li>
          <li>Numéro SIRET, si tu demandes le badge cuisinier</li>
          <li>Photos que tu ajoutes à tes annonces ou à ton jardin</li>
          <li>Contenu des messages échangés via la messagerie Kagette</li>
          <li>Identifiant de ton compte Stripe Connect, si tu reçois des paiements</li>
          <li>Avis laissés et reçus, signalements que tu effectues</li>
        </ul>
      </section>

      <section className="space-y-2 text-sm text-kagette-prune-700/80">
        <h2 className="font-semibold text-kagette-prune-700">Pourquoi ces données</h2>
        <p>
          Ces données servent uniquement à faire fonctionner la mise en relation : afficher tes
          annonces, permettre aux autres utilisateurs de te contacter, traiter les paiements et
          leur répartition, et assurer un minimum de confiance entre membres (avis, signalements,
          badge hygiène).
        </p>
      </section>

      <section className="space-y-2 text-sm text-kagette-prune-700/80">
        <h2 className="font-semibold text-kagette-prune-700">Partage des données</h2>
        <p>
          Tes coordonnées bancaires ne transitent jamais par Kagette : elles sont traitées
          directement par Stripe. Ton prénom et ta zone de retrait approximative sont visibles des
          autres utilisateurs sur tes annonces. Aucune donnée n&apos;est vendue à des tiers.
        </p>
      </section>

      <section className="space-y-2 text-sm text-kagette-prune-700/80">
        <h2 className="font-semibold text-kagette-prune-700">Durée de conservation</h2>
        <p>[À définir], en attendant, les données sont conservées tant que ton compte existe.</p>
      </section>

      <section className="space-y-2 text-sm text-kagette-prune-700/80">
        <h2 className="font-semibold text-kagette-prune-700">Tes droits</h2>
        <p>
          Conformément au RGPD, tu peux modifier tes informations (prénom, nom, téléphone, photo)
          et supprimer ton compte toi-même, à tout moment, depuis la page « Zone dangereuse » de
          ton profil. Lors d&apos;une suppression, tes informations personnelles sont effacées ;
          les commandes, avis et messages déjà échangés restent visibles pour les autres
          utilisateurs mais ne sont plus associés à ton identité (nom remplacé par « Utilisateur
          supprimé »). Pour toute autre demande, écris à contact.kagette@gmail.com.
        </p>
      </section>
    </div>
  );
}
