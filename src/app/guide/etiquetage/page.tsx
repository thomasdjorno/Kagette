import Link from "next/link";
import { Card } from "@/components/ui/Card";

export const metadata = { title: "Étiquetage obligatoire — Guide" };

export default function GuideEtiquetagePage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link href="/guide" className="text-sm text-kagette-framboise-600 hover:underline">
        ← Retour au guide
      </Link>

      <div>
        <h1 className="font-serif text-2xl font-bold text-kagette-prune-700">
          🏷️ Étiquetage obligatoire
        </h1>
        <p className="mt-2 text-sm text-kagette-prune-700/70">
          Même vendu par un particulier, un produit alimentaire préemballé doit porter certaines
          mentions sur son étiquette (réglementation européenne INCO). Kagette te demande déjà les
          informations principales à la création de ton annonce — cette page explique pourquoi, et
          ce qu&apos;il faut aussi écrire sur le bocal lui-même.
        </p>
      </div>

      <Card>
        <h2 className="font-semibold text-kagette-prune-700">Ce que Kagette te demande déjà</h2>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-kagette-prune-700/80">
          <li>La <strong>DLUO</strong> (date limite d&apos;utilisation optimale)</li>
          <li>Les <strong>allergènes</strong> présents dans la recette</li>
          <li>La <strong>quantité disponible</strong> et le <strong>prix</strong></li>
        </ul>
        <p className="mt-2 text-sm text-kagette-prune-700/80">
          Ces informations apparaissent automatiquement sur ta fiche produit Kagette — mais elles
          doivent aussi figurer sur l&apos;étiquette physique du bocal que tu remets à
          l&apos;acheteur.
        </p>
      </Card>

      <Card>
        <h2 className="font-semibold text-kagette-prune-700">Ce qu&apos;il faut aussi écrire sur le bocal</h2>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-kagette-prune-700/80">
          <li>La <strong>dénomination</strong> du produit (ex : &laquo; Confiture de pommes reinette &raquo;)</li>
          <li>La <strong>liste des ingrédients</strong>, dans l&apos;ordre décroissant de poids</li>
          <li>Les <strong>allergènes</strong> mis en évidence (en gras ou soulignés dans la liste)</li>
          <li>Le <strong>poids net</strong> du contenu</li>
          <li>La <strong>DLUO</strong> (&laquo; à consommer de préférence avant... &raquo;)</li>
          <li>Ton <strong>nom</strong> et ta <strong>commune</strong> en tant que préparateur</li>
          <li>Les <strong>conditions de conservation</strong> (ex : &laquo; à conserver au sec, une fois ouvert au réfrigérateur &raquo;)</li>
        </ul>
      </Card>

      <Card>
        <h2 className="font-semibold text-kagette-prune-700">Les 14 allergènes à toujours signaler</h2>
        <p className="mt-2 text-sm text-kagette-prune-700/80">
          Gluten, crustacés, œufs, poissons, arachides, soja, lait, fruits à coque, céleri,
          moutarde, graines de sésame, sulfites (souvent présents dans les fruits secs et
          confitures), lupin, mollusques. Signale-les dès qu&apos;ils sont présents, même en toute
          petite quantité.
        </p>
      </Card>

      <div className="rounded-xl border border-kagette-mangue-300 bg-kagette-mangue-50 p-4 text-sm text-kagette-prune-700">
        💡 Idée à venir sur Kagette : un générateur d&apos;étiquettes prêtes à imprimer, aux
        couleurs Kagette, qui reprend automatiquement les informations de ton annonce.
      </div>
    </div>
  );
}
