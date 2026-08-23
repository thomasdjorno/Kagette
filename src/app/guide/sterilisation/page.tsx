import Link from "next/link";
import { Card } from "@/components/ui/Card";

export const metadata = { title: "Stériliser ses bocaux — Guide" };

export default function GuideSterilisationPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link href="/guide" className="text-sm text-kagette-framboise-600 hover:underline">
        ← Retour au guide
      </Link>

      <div>
        <h1 className="font-serif text-2xl font-bold text-kagette-prune-700">
          🫙 Stériliser ses bocaux
        </h1>
        <p className="mt-2 text-sm text-kagette-prune-700/70">
          La stérilisation élimine les micro-organismes qui feraient tourner ta préparation. C&apos;est
          l&apos;étape la plus importante pour une bonne conservation.
        </p>
      </div>

      <Card>
        <h2 className="font-semibold text-kagette-prune-700">1. Choisir les bons bocaux</h2>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-kagette-prune-700/80">
          <li>Utilise des bocaux en verre avec un couvercle en bon état (pas de joint abîmé).</li>
          <li>Vérifie l&apos;absence de fissures ou d&apos;ébréchures.</li>
          <li>Les bocaux à joint caoutchouc (type Le Parfait) ou à capsule twist se réutilisent bien.</li>
        </ul>
      </Card>

      <Card>
        <h2 className="font-semibold text-kagette-prune-700">2. Stériliser avant remplissage</h2>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-kagette-prune-700/80">
          <li>Lave les bocaux et couvercles à l&apos;eau chaude savonneuse, rince bien.</li>
          <li>
            Plonge-les dans une grande casserole d&apos;eau bouillante pendant 10 minutes (bocaux
            et couvercles), ou passe-les au four à 120°C pendant 10 minutes.
          </li>
          <li>Laisse-les sécher à l&apos;envers sur un torchon propre, sans les essuyer avec un tissu qui pourrait les recontaminer.</li>
        </ul>
      </Card>

      <Card>
        <h2 className="font-semibold text-kagette-prune-700">3. Remplir à chaud</h2>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-kagette-prune-700/80">
          <li>Verse ta préparation encore chaude (confiture, sirop, chutney) dans les bocaux stérilisés.</li>
          <li>Remplis jusqu&apos;à 1 cm du bord, ferme immédiatement.</li>
          <li>Retourne les bocaux quelques minutes pour stériliser le couvercle par la chaleur, puis remets-les à l&apos;endroit.</li>
        </ul>
      </Card>

      <Card>
        <h2 className="font-semibold text-kagette-prune-700">4. Pour une conservation longue : le bain-marie</h2>
        <p className="mt-2 text-sm text-kagette-prune-700/80">
          Pour les préparations peu sucrées ou peu acides (certains chutneys, sirops dilués), une
          stérilisation supplémentaire des bocaux fermés et remplis est recommandée : immerge-les
          dans l&apos;eau bouillante (bocaux couverts d&apos;au moins 2 cm d&apos;eau) pendant 20 à
          30 minutes selon la taille du bocal, puis laisse refroidir dans l&apos;eau.
        </p>
      </Card>

      <Card className="border-kagette-feuille-300 bg-kagette-feuille-50">
        <h2 className="font-semibold text-kagette-prune-700">✅ Vérifier avant de vendre</h2>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-kagette-prune-700/80">
          <li>Le couvercle doit être creux ou plat, pas bombé — signe que le vide s&apos;est bien fait.</li>
          <li>Si tu appuies sur le centre du couvercle (type twist), il ne doit pas faire de bruit de &laquo; clic &raquo;.</li>
          <li>Aucune bulle, mousse ou odeur inhabituelle à l&apos;ouverture.</li>
          <li>En cas de doute sur un bocal : ne le vends pas.</li>
        </ul>
      </Card>
    </div>
  );
}
