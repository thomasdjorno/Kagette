import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.estAdmin) redirect("/connexion");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-kagette-prune-700">Backoffice</h1>
        <nav className="mt-3 flex flex-wrap gap-2 border-b border-kagette-prune-700/10 pb-3">
          <Link
            href="/admin"
            className="rounded-full px-3 py-1.5 text-sm font-medium text-kagette-prune-700 hover:bg-kagette-prune-700/5"
          >
            Vue d&apos;ensemble
          </Link>
          <Link
            href="/admin/regions"
            className="rounded-full px-3 py-1.5 text-sm font-medium text-kagette-prune-700 hover:bg-kagette-prune-700/5"
          >
            Régions
          </Link>
          <Link
            href="/admin/badges"
            className="rounded-full px-3 py-1.5 text-sm font-medium text-kagette-prune-700 hover:bg-kagette-prune-700/5"
          >
            Badges hygiène
          </Link>
          <Link
            href="/admin/signalements"
            className="rounded-full px-3 py-1.5 text-sm font-medium text-kagette-prune-700 hover:bg-kagette-prune-700/5"
          >
            Signalements
          </Link>
          <Link
            href="/admin/repartition"
            className="rounded-full px-3 py-1.5 text-sm font-medium text-kagette-prune-700 hover:bg-kagette-prune-700/5"
          >
            Répartition
          </Link>
        </nav>
      </div>
      {children}
    </div>
  );
}
