import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";

export default async function AdminOverviewPage() {
  const [regionsActives, badgesEnAttente, signalementsEnAttente] = await Promise.all([
    prisma.region.count({ where: { isActive: true } }),
    prisma.user.count({ where: { hygieneBadgeStatus: "EN_ATTENTE" } }),
    prisma.report.count({ where: { statut: "EN_ATTENTE" } }),
  ]);

  const cartes = [
    { label: "Régions actives", valeur: regionsActives, href: "/admin/regions" },
    { label: "Badges en attente", valeur: badgesEnAttente, href: "/admin/badges" },
    { label: "Signalements en attente", valeur: signalementsEnAttente, href: "/admin/signalements" },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {cartes.map((carte) => (
        <Link key={carte.href} href={carte.href}>
          <Card className="transition-shadow hover:shadow-md">
            <p className="text-sm text-kagette-prune-700/60">{carte.label}</p>
            <p className="mt-1 text-3xl font-bold text-kagette-framboise-600">{carte.valeur}</p>
          </Card>
        </Link>
      ))}
    </div>
  );
}
