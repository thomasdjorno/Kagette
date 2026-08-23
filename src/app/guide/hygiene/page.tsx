import Link from "next/link";
import { Card } from "@/components/ui/Card";

export const metadata = { title: "Hygiène & charte Kagette — Guide" };

export default function GuideHygienePage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link href="/guide" className="text-sm text-kagette-framboise-600 hover:underline">
        ← Retour au guide
      </Link>

      <div>
        <h1 className="font-serif text-2xl font-bold text-kagette-prune-700">
          🧼 Hygiène de base & charte Kagette
        </h1>
        <p className="mt-2 text-sm text-kagette-prune-700/70">
          Transformer des fruits chez soi ne demande pas de matériel professionnel, mais quelques
          règles simples évitent les mauvaises surprises — pour toi et pour ceux qui achètent tes
          produits.
        </p>
      </div>

      <Card>
        <h2 className="font-semibold text-kagette-prune-700">Avant de commencer</h2>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-kagette-prune-700/80">
          <li>Lave-toi les mains et nettoie ton plan de travail avant de commencer.</li>
          <li>Utilise des ustensiles et bocaux propres, rincés à l&apos;eau claire.</li>
          <li>Écarte les fruits abîmés, moisis ou trop mûrs — trie avant de transformer.</li>
          <li>
            Ne prépare pas de produits à vendre si tu es malade (rhume, gastro...) : le risque de
            contamination augmente.
          </li>
        </ul>
      </Card>

      <Card>
        <h2 className="font-semibold text-kagette-prune-700">Pendant la préparation</h2>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-kagette-prune-700/80">
          <li>Respecte les temps de cuisson complets (voir le guide par produit).</li>
          <li>Évite les contaminations croisées : ne réutilise pas un ustensile cru sur du cuit sans le laver.</li>
          <li>Stérilise systématiquement tes bocaux (voir le guide dédié).</li>
          <li>Note la date de préparation — elle te sert à calculer la DLUO à indiquer sur l&apos;annonce.</li>
        </ul>
      </Card>

      <Card>
        <h2 className="font-semibold text-kagette-prune-700">Après la préparation</h2>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-kagette-prune-700/80">
          <li>Stocke tes bocaux à l&apos;abri de la lumière et de la chaleur.</li>
          <li>Vérifie qu&apos;un bocal n&apos;a pas gonflé ou que le couvercle ne s&apos;est pas soulevé avant de le vendre — jette-le si c&apos;est le cas.</li>
          <li>Renseigne honnêtement les allergènes et la DLUO sur ton annonce Kagette.</li>
        </ul>
      </Card>

      <Card className="border-kagette-feuille-300 bg-kagette-feuille-50">
        <h2 className="font-semibold text-kagette-prune-700">📋 La charte d&apos;hygiène Kagette</h2>
        <p className="mt-2 text-sm text-kagette-prune-700/80">
          En cochant la case d&apos;acceptation dans ton profil, tu confirmes que :
        </p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-kagette-prune-700/80">
          <li>tu as lu et appliques les règles d&apos;hygiène décrites sur cette page ;</li>
          <li>les informations que tu donnes sur tes produits (ingrédients, allergènes, DLUO) sont exactes ;</li>
          <li>tu vends dans le cadre autorisé pour un particulier (voir le cadre légal) ;</li>
          <li>tu es seul responsable de la conformité sanitaire de tes préparations — Kagette est un intermédiaire de mise en relation, pas un organisme de certification sanitaire.</li>
        </ul>
        <p className="mt-3 text-xs text-kagette-prune-700/50">
          Cette charte est une exigence interne à Kagette pour instaurer la confiance entre
          membres. Elle ne remplace pas et ne dispense d&apos;aucune obligation légale — voir le{" "}
          <Link href="/guide/cadre-legal" className="underline">
            cadre légal
          </Link>
          .
        </p>
      </Card>
    </div>
  );
}
