import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { libellesBadgeHygiene } from "@/lib/format";
import { CuisinierPanel } from "../CuisinierPanel";

export default async function BadgeCuisinierPage() {
  const session = await auth();
  if (!session?.user) redirect("/connexion?callbackUrl=/profil/badge-cuisinier");

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) redirect("/api/auth/signout?callbackUrl=/connexion");

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-kagette-prune-700">
          👩‍🍳 Le badge cuisinier
        </h1>
        <p className="mt-2 text-sm text-kagette-prune-700/70">
          Le badge hygiène est ce qui rassure les acheteurs sur Kagette : il indique que tu as pris
          connaissance des règles d&apos;hygiène de base et que tu t&apos;engages à les respecter.
          Sans ce badge, tu peux donner tes fruits en tant que donneur, mais tu ne peux pas vendre
          de produits transformés.
        </p>
      </div>

      <Card className="border-kagette-feuille-300 bg-kagette-feuille-50">
        <p className="text-sm font-semibold text-kagette-prune-700">Statut actuel</p>
        <p className="mt-1 text-sm text-kagette-prune-700/80">
          {libellesBadgeHygiene[user.hygieneBadgeStatus]}
        </p>
      </Card>

      <Card>
        <h2 className="font-semibold text-kagette-prune-700">Ce qu&apos;il faut pour l&apos;obtenir</h2>
        <ol className="mt-2 list-inside list-decimal space-y-2 text-sm text-kagette-prune-700/80">
          <li>
            Lire le{" "}
            <Link href="/guide/hygiene" className="text-kagette-framboise-600 underline">
              guide d&apos;hygiène et la charte Kagette
            </Link>{" "}
            — les bases pour transformer des fruits en toute sécurité chez toi.
          </li>
          <li>
            Vérifier que ta situation correspond au{" "}
            <Link href="/guide/cadre-legal" className="text-kagette-framboise-600 underline">
              cadre légal de la vente
            </Link>{" "}
            (vente occasionnelle ou micro-entreprise selon ton cas).
          </li>
          <li>
            Renseigner ton numéro SIRET si tu en as un (facultatif pour l&apos;instant, le temps
            que Kagette soit en phase pilote).
          </li>
          <li>Cocher la case d&apos;acceptation de la charte ci-dessous et envoyer ta demande.</li>
          <li>Un membre de l&apos;équipe Kagette valide ta demande manuellement — tu reçois une confirmation dès que c&apos;est fait.</li>
        </ol>
      </Card>

      <Card>
        <h2 className="mb-1 font-semibold text-kagette-prune-700">Demander le badge</h2>
        <CuisinierPanel estCuisinier={user.estCuisinier} hygieneBadgeStatus={user.hygieneBadgeStatus} />
      </Card>

      <p className="text-sm text-kagette-prune-700/60">
        Une fois ton badge validé, retrouve nos conseils pratiques (stérilisation, étiquetage,
        conservation par produit) dans{" "}
        <Link href="/guide" className="text-kagette-framboise-600 underline">
          le guide complet du Kagetteur
        </Link>
        .
      </p>
    </div>
  );
}
