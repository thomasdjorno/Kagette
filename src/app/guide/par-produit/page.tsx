import Link from "next/link";
import { Card } from "@/components/ui/Card";

export const metadata = { title: "Conseils par type de produit — Guide" };

export default function GuideParProduitPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link href="/guide" className="text-sm text-kagette-framboise-600 hover:underline">
        ← Retour au guide
      </Link>

      <div>
        <h1 className="font-serif text-2xl font-bold text-kagette-prune-700">
          🍯 Conseils par type de produit
        </h1>
        <p className="mt-2 text-sm text-kagette-prune-700/70">
          Chaque type de transformation a ses propres points de vigilance pour bien se conserver.
        </p>
      </div>

      <Card>
        <h2 className="font-semibold text-kagette-prune-700">Confitures</h2>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-kagette-prune-700/80">
          <li>Un bon ratio sucre/fruit (classiquement autour de 800g de sucre pour 1kg de fruits) aide à la conservation — moins de sucre veut dire une DLUO plus courte.</li>
          <li>Cuis jusqu&apos;à ce qu&apos;une goutte posée sur une assiette froide se fige (test de nappage).</li>
          <li>Mets en bocal bouillante, dès la fin de cuisson.</li>
        </ul>
      </Card>

      <Card>
        <h2 className="font-semibold text-kagette-prune-700">Sirops</h2>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-kagette-prune-700/80">
          <li>Filtre bien pour retirer pulpe et impuretés avant la mise en bouteille.</li>
          <li>Une bonne concentration en sucre aide à la conservation ; un sirop peu sucré se conserve moins longtemps et doit être gardé au frais.</li>
          <li>Utilise des bouteilles en verre stérilisées, remplies à chaud, fermées immédiatement.</li>
        </ul>
      </Card>

      <Card>
        <h2 className="font-semibold text-kagette-prune-700">Chutneys</h2>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-kagette-prune-700/80">
          <li>Le vinaigre (acidité) est ton meilleur allié pour la conservation — ne réduis pas trop la quantité par rapport à une recette éprouvée.</li>
          <li>Cuis suffisamment longtemps pour que les fruits/légumes soient bien tendres et que le mélange ait épaissi.</li>
          <li>Un chutney moins acide se rapproche d&apos;un plat cuisiné : conservation plus courte, à indiquer clairement dans la DLUO.</li>
        </ul>
      </Card>

      <Card>
        <h2 className="font-semibold text-kagette-prune-700">Fruits secs</h2>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-kagette-prune-700/80">
          <li>Le séchage doit être complet — un fruit encore souple à cœur retient de l&apos;humidité qui favorise les moisissures.</li>
          <li>Laisse refroidir complètement avant de stocker, pour éviter la condensation dans le contenant.</li>
          <li>Utilise un contenant hermétique, à l&apos;abri de la lumière et de l&apos;humidité.</li>
          <li>Vérifie régulièrement l&apos;absence de moisissure pendant le stockage si tu gardes un stock avant de vendre.</li>
        </ul>
      </Card>

      <p className="text-sm text-kagette-prune-700/70">
        Voir aussi <Link href="/guide/sterilisation" className="underline">la stérilisation des bocaux</Link>.
      </p>
    </div>
  );
}
