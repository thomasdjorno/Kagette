import Link from "next/link";

export function Pagination({
  page,
  totalPages,
  paramName,
  otherParams,
}: {
  page: number;
  totalPages: number;
  paramName: string;
  otherParams?: Record<string, string>;
}) {
  if (totalPages <= 1) return null;

  function hrefPourPage(p: number) {
    const params = new URLSearchParams();
    for (const [cle, valeur] of Object.entries(otherParams ?? {})) {
      if (valeur) params.set(cle, valeur);
    }
    params.set(paramName, String(p));
    return `?${params.toString()}`;
  }

  return (
    <div className="mt-4 flex items-center justify-center gap-3">
      {page > 1 ? (
        <Link
          href={hrefPourPage(page - 1)}
          className="rounded-full bg-kagette-prune-700/5 px-4 py-2 text-sm font-medium text-kagette-prune-700 hover:bg-kagette-prune-700/10"
        >
          ← Précédent
        </Link>
      ) : (
        <span className="rounded-full px-4 py-2 text-sm font-medium text-kagette-prune-700/30">
          ← Précédent
        </span>
      )}
      <span className="text-sm text-kagette-prune-700/60">
        Page {page} / {totalPages}
      </span>
      {page < totalPages ? (
        <Link
          href={hrefPourPage(page + 1)}
          className="rounded-full bg-kagette-prune-700/5 px-4 py-2 text-sm font-medium text-kagette-prune-700 hover:bg-kagette-prune-700/10"
        >
          Suivant →
        </Link>
      ) : (
        <span className="rounded-full px-4 py-2 text-sm font-medium text-kagette-prune-700/30">
          Suivant →
        </span>
      )}
    </div>
  );
}
