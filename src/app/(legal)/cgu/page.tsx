export const metadata = { title: "Conditions générales d'utilisation — Kagette" };

export default function CguPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="font-serif text-2xl font-bold text-kagette-prune-700">
        Conditions générales d&apos;utilisation
      </h1>

      <div className="rounded-xl border border-kagette-mangue-300 bg-kagette-mangue-50 p-4 text-sm text-kagette-prune-700">
        ⚠️ Ce texte est un point de départ décrivant le fonctionnement réel de
        l&apos;application. Il ne remplace pas une relecture par un professionnel du droit avant
        un vrai lancement, notamment sur les clauses de responsabilité et de résiliation.
      </div>

      <section className="space-y-2 text-sm text-kagette-prune-700/80">
        <h2 className="font-semibold text-kagette-prune-700">1. Objet</h2>
        <p>
          Kagette est une plateforme de mise en relation entre trois types d&apos;utilisateurs,
          dans la zone pilote de Mensignac et alentours (Dordogne) :
        </p>
        <ul className="list-inside list-disc space-y-1">
          <li>les <strong>donneurs</strong>, qui proposent des fruits en surplus de leur jardin</li>
          <li>
            les <strong>cuisiniers</strong>, qui transforment ces fruits en confitures, sirops,
            chutneys ou fruits secs et les vendent
          </li>
          <li>les <strong>acheteurs</strong>, qui achètent ces produits transformés</li>
        </ul>
        <p>Un même compte peut cumuler plusieurs de ces rôles.</p>
      </section>

      <section className="space-y-2 text-sm text-kagette-prune-700/80">
        <h2 className="font-semibold text-kagette-prune-700">2. Rôle de Kagette</h2>
        <p>
          Kagette est un intermédiaire technique : la plateforme met en relation les utilisateurs
          et facilite le paiement, mais n&apos;est ni donneur, ni cuisinier, ni transporteur. La
          remise des fruits et des produits se fait directement entre utilisateurs, aux lieux et
          horaires qu&apos;ils conviennent entre eux.
        </p>
      </section>

      <section className="space-y-2 text-sm text-kagette-prune-700/80">
        <h2 className="font-semibold text-kagette-prune-700">3. Paiement et répartition</h2>
        <p>
          Lorsqu&apos;un produit transformé est acheté, le montant payé par l&apos;acheteur est
          automatiquement réparti entre le donneur des fruits d&apos;origine (s&apos;il y en a
          un), le cuisinier, et Kagette au titre de sa commission de mise en relation. Les
          pourcentages appliqués sont visibles avant l&apos;achat. Les paiements sont traités par
          Stripe ; Kagette ne stocke aucune coordonnée bancaire.
        </p>
      </section>

      <section className="space-y-2 text-sm text-kagette-prune-700/80">
        <h2 className="font-semibold text-kagette-prune-700">4. Hygiène et sécurité alimentaire</h2>
        <p>
          Tout cuisinier doit accepter la charte d&apos;hygiène Kagette et faire valider son
          profil avant de pouvoir vendre des produits transformés. Kagette effectue une
          vérification déclarative mais ne garantit pas la conformité sanitaire de chaque
          préparation : chaque cuisinier reste seul responsable du respect des règles
          d&apos;hygiène applicables à la préparation et à la vente de denrées alimentaires.
        </p>
      </section>

      <section className="space-y-2 text-sm text-kagette-prune-700/80">
        <h2 className="font-semibold text-kagette-prune-700">5. Comportement des utilisateurs</h2>
        <p>
          Chaque utilisateur s&apos;engage à fournir des informations exactes sur ses annonces
          (quantité, origine, allergènes), à respecter les autres membres dans la messagerie, et à
          signaler tout contenu ou comportement problématique via la fonction de signalement.
          Kagette se réserve le droit de suspendre un compte en cas d&apos;abus.
        </p>
      </section>

      <section className="space-y-2 text-sm text-kagette-prune-700/80">
        <h2 className="font-semibold text-kagette-prune-700">6. Modification des CGU</h2>
        <p>
          Ces conditions peuvent évoluer. La version en vigueur est celle publiée sur cette page.
        </p>
      </section>
    </div>
  );
}
