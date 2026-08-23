import Link from "next/link";
import { Card } from "@/components/ui/Card";

export const metadata = { title: "Cadre légal de la vente — Guide" };

export default function GuideCadreLegalPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link href="/guide" className="text-sm text-kagette-framboise-600 hover:underline">
        ← Retour au guide
      </Link>

      <div>
        <h1 className="font-serif text-2xl font-bold text-kagette-prune-700">
          ⚖️ Cadre légal de la vente
        </h1>
        <p className="mt-2 text-sm text-kagette-prune-700/70">
          Vendre quelques bocaux de confiture entre voisins n&apos;est pas la même chose que
          vendre régulièrement. Voici les grandes lignes pour savoir où tu te situes.
        </p>
      </div>

      <div className="rounded-xl border border-kagette-mangue-300 bg-kagette-mangue-50 p-4 text-sm text-kagette-prune-700">
        ⚠️ Cette page donne des repères généraux, pas un conseil juridique personnalisé. En cas de
        doute sur ta situation, contacte la Chambre des Métiers et de l&apos;Artisanat ou la
        DDPP/DDETSPP de ton département — elles renseignent gratuitement les particuliers.
      </div>

      <Card>
        <h2 className="font-semibold text-kagette-prune-700">Vente occasionnelle</h2>
        <p className="mt-2 text-sm text-kagette-prune-700/80">
          Vendre ponctuellement le surplus de ta production familiale (quelques bocaux par an, pas
          d&apos;activité récurrente organisée) relève généralement de la vente occasionnelle entre
          particuliers, sans obligation de déclaration d&apos;activité. C&apos;est le cadre visé
          par la plupart des <strong>donneurs</strong> de fruits sur Kagette.
        </p>
      </Card>

      <Card>
        <h2 className="font-semibold text-kagette-prune-700">Activité régulière de cuisinier</h2>
        <p className="mt-2 text-sm text-kagette-prune-700/80">
          Dès que la vente de produits transformés devient une activité répétée et organisée (même
          à petite échelle), elle doit en principe être déclarée : le statut de{" "}
          <strong>micro-entrepreneur (auto-entrepreneur)</strong> est la solution la plus simple
          pour un particulier — inscription rapide en ligne, cotisations proportionnelles au
          chiffre d&apos;affaires réalisé, pas de TVA en dessous des seuils en vigueur.
        </p>
        <p className="mt-2 text-sm text-kagette-prune-700/80">
          Une fois déclaré, il faut aussi signaler ton activité de transformation de denrées
          alimentaires auprès de la DDPP/DDETSPP de ton département (déclaration
          d&apos;établissement), qui peut effectuer des contrôles d&apos;hygiène.
        </p>
      </Card>

      <Card>
        <h2 className="font-semibold text-kagette-prune-700">Le numéro SIRET sur Kagette</h2>
        <p className="mt-2 text-sm text-kagette-prune-700/80">
          Le SIRET est optionnel pour demander le badge cuisinier en V1 — Kagette est un pilote à
          petite échelle. Mais si tu vends régulièrement, c&apos;est à toi de vérifier que ta
          situation est en règle : le badge Kagette atteste que tu as accepté notre charte
          d&apos;hygiène, pas que ton statut juridique est en ordre.
        </p>
      </Card>

      <Card>
        <h2 className="font-semibold text-kagette-prune-700">Assurance</h2>
        <p className="mt-2 text-sm text-kagette-prune-700/80">
          Une assurance responsabilité civile (souvent déjà incluse dans une RC vie privée, ou une
          RC professionnelle une fois micro-entrepreneur) est recommandée pour te couvrir en cas de
          souci lié à un produit vendu.
        </p>
      </Card>

      <p className="text-sm text-kagette-prune-700/70">
        Voir aussi le guide sur <Link href="/guide/hygiene" className="underline">l&apos;hygiène</Link> et{" "}
        <Link href="/guide/etiquetage" className="underline">l&apos;étiquetage</Link>.
      </p>
    </div>
  );
}
