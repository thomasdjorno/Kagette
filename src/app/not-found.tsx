import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-16 text-center">
      <p className="text-5xl">🍃</p>
      <h1 className="font-serif text-2xl font-bold text-kagette-prune-700">
        Cette page s&apos;est envolée
      </h1>
      <p className="text-sm text-kagette-prune-700/70">
        La page que tu cherches n&apos;existe pas, ou a été déplacée, peut-être une annonce qui
        n&apos;est plus disponible.
      </p>
      <Link href="/">
        <Button variant="primary">Retour à l&apos;accueil</Button>
      </Link>
    </div>
  );
}
