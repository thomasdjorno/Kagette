import { Card } from "@/components/ui/Card";
import { MotDePasseOublieForm } from "./MotDePasseOublieForm";

export default function MotDePasseOubliePage() {
  return (
    <div className="mx-auto max-w-md">
      <Card>
        <h1 className="text-xl font-serif font-bold text-kagette-prune-700">
          Mot de passe oublié
        </h1>
        <p className="mt-2 text-sm text-kagette-prune-700/60">
          Indique ton email, on t&apos;envoie un lien pour choisir un nouveau mot de passe.
        </p>
        <MotDePasseOublieForm />
      </Card>
    </div>
  );
}
