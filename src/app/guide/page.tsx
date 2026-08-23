import Link from "next/link";
import { Card } from "@/components/ui/Card";

const articles = [
  {
    href: "/guide/hygiene",
    emoji: "🧼",
    titre: "Hygiène de base & charte Kagette",
    resume: "Les règles à suivre pour transformer des fruits en toute sécurité chez toi.",
  },
  {
    href: "/guide/sterilisation",
    emoji: "🫙",
    titre: "Stériliser ses bocaux",
    resume: "La méthode pour que tes confitures, sirops et chutneys se conservent bien.",
  },
  {
    href: "/guide/etiquetage",
    emoji: "🏷️",
    titre: "Étiquetage obligatoire",
    resume: "Ce qu'il faut écrire sur chaque bocal : DLUO, allergènes, ingrédients...",
  },
  {
    href: "/guide/cadre-legal",
    emoji: "⚖️",
    titre: "Cadre légal de la vente",
    resume: "Vente occasionnelle ou activité déclarée ? Ce que dit la réglementation.",
  },
  {
    href: "/guide/par-produit",
    emoji: "🍯",
    titre: "Conseils par type de produit",
    resume: "Confitures, sirops, chutneys, fruits secs : les bons réflexes pour chacun.",
  },
];

export default function GuidePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-kagette-prune-700">
          Le guide du Kagetteur
        </h1>
        <p className="mt-2 text-sm text-kagette-prune-700/70">
          Tout ce qu&apos;il faut savoir pour produire et vendre tes préparations en toute
          sécurité, écrit pour des particuliers — pas besoin d&apos;être professionnel de
          l&apos;agroalimentaire pour bien faire.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {articles.map((article) => (
          <Link key={article.href} href={article.href}>
            <Card className="h-full transition-shadow hover:shadow-md">
              <span className="text-2xl">{article.emoji}</span>
              <h2 className="mt-2 font-serif font-bold text-kagette-prune-700">{article.titre}</h2>
              <p className="mt-1 text-sm text-kagette-prune-700/60">{article.resume}</p>
            </Card>
          </Link>
        ))}
      </div>

      <div className="rounded-xl border border-kagette-mangue-300 bg-kagette-mangue-50 p-4 text-sm text-kagette-prune-700">
        ⚠️ Ce guide donne des repères pratiques et généraux. Il ne remplace pas les
        recommandations officielles (DDPP/DDETSPP de ton département, chambre des métiers) si tu as
        un doute sur ta situation précise.
      </div>
    </div>
  );
}
