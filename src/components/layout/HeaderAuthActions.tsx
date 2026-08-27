import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function HeaderAuthActions() {
  return (
    <div className="flex items-center gap-2">
      <Link href="/connexion">
        <Button variant="ghost">Connexion</Button>
      </Link>
      <Link href="/inscription">
        <Button variant="primary">S&apos;inscrire</Button>
      </Link>
    </div>
  );
}
