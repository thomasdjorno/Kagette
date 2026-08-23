import { formatDate } from "@/lib/format";

interface ReviewItem {
  id: string;
  note: number;
  commentaire: string | null;
  createdAt: Date;
  auteur: { prenom: string };
}

export function ReviewList({ reviews }: { reviews: ReviewItem[] }) {
  if (reviews.length === 0) {
    return <p className="text-sm text-kagette-prune-700/50">Aucun avis pour l&apos;instant.</p>;
  }

  const moyenne = reviews.reduce((somme, r) => somme + r.note, 0) / reviews.length;

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <span className="text-lg font-bold text-kagette-mangue-600">★ {moyenne.toFixed(1)}</span>
        <span className="text-sm text-kagette-prune-700/50">
          ({reviews.length} avis{reviews.length > 1 ? "" : ""})
        </span>
      </div>
      <ul className="space-y-3">
        {reviews.map((review) => (
          <li key={review.id} className="border-t border-kagette-prune-700/10 pt-3 first:border-0 first:pt-0">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-kagette-prune-700">
                {"★".repeat(review.note)}
                {"☆".repeat(5 - review.note)}
              </span>
              <span className="text-xs text-kagette-prune-700/40">
                {review.auteur.prenom}, {formatDate(review.createdAt)}
              </span>
            </div>
            {review.commentaire && (
              <p className="mt-1 text-sm text-kagette-prune-700/80">{review.commentaire}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
