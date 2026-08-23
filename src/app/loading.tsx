export default function Loading() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-kagette-feuille-200 border-t-kagette-feuille-600" />
      <p className="text-sm text-kagette-prune-700/50">Chargement...</p>
    </div>
  );
}
