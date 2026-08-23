export const metadata = { title: "Mentions légales — Kagette" };

export default function MentionsLegalesPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="font-serif text-2xl font-bold text-kagette-prune-700">Mentions légales</h1>

      <div className="rounded-xl border border-kagette-mangue-300 bg-kagette-mangue-50 p-4 text-sm text-kagette-prune-700">
        ⚠️ Page à compléter avant mise en ligne réelle : les champs entre crochets doivent être
        remplacés par les informations exactes de l&apos;exploitant du site. Une mention légale
        incomplète ou fausse est un manquement à la loi pour la confiance dans l&apos;économie
        numérique (LCEN).
      </div>

      <section className="space-y-2 text-sm text-kagette-prune-700/80">
        <h2 className="font-semibold text-kagette-prune-700">Éditeur du site</h2>
        <p>
          [Nom / raison sociale] — [forme juridique, ex. entreprise individuelle, SASU...]
          <br />
          Adresse : [adresse complète]
          <br />
          SIRET : [numéro SIRET]
          <br />
          Email : [email de contact]
          <br />
          Directeur de la publication : [nom]
        </p>
      </section>

      <section className="space-y-2 text-sm text-kagette-prune-700/80">
        <h2 className="font-semibold text-kagette-prune-700">Hébergement</h2>
        <p>
          Ce site est hébergé par [nom de l&apos;hébergeur, ex. Vercel Inc. / Netlify Inc.]
          <br />
          [Adresse de l&apos;hébergeur]
        </p>
      </section>

      <section className="space-y-2 text-sm text-kagette-prune-700/80">
        <h2 className="font-semibold text-kagette-prune-700">Paiements</h2>
        <p>
          Les paiements effectués sur Kagette sont traités par Stripe Payments Europe, Ltd.
          Kagette n&apos;a accès à aucune donnée bancaire des utilisateurs.
        </p>
      </section>

      <section className="space-y-2 text-sm text-kagette-prune-700/80">
        <h2 className="font-semibold text-kagette-prune-700">Propriété intellectuelle</h2>
        <p>
          Le nom Kagette, son logo et sa mascotte sont la propriété de [nom de l&apos;éditeur].
          Toute reproduction sans autorisation est interdite.
        </p>
      </section>
    </div>
  );
}
