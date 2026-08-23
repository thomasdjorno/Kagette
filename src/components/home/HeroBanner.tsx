import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

export function HeroBanner({ isAuthenticated }: { isAuthenticated: boolean }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-kagette-framboise-500 px-6 py-10 sm:px-10 sm:py-14">
      <div className="relative z-10 max-w-lg">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-kagette-mangue-300">
          Mensignac et alentours — Dordogne
        </p>
        <h1 className="mt-3 font-serif text-4xl font-extrabold leading-tight text-white sm:text-5xl">
          Les fruits du jardin, transformés près de chez vous
        </h1>
        <p className="mt-4 text-white/80">
          Kagette relie les jardins qui débordent de fruits aux cuisiniers locaux qui les
          transforment en confitures, sirops, chutneys et fruits secs.
        </p>
        <div className="mt-6 flex items-center gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {isAuthenticated ? (
              <>
                <Link href="/fruits/nouveau">
                  <Button variant="invert">Proposer des fruits</Button>
                </Link>
                <Link href="/produits/nouveau">
                  <Button variant="invert-outline">Publier un produit</Button>
                </Link>
              </>
            ) : (
              <Link href="/inscription">
                <Button variant="invert">Rejoindre Kagette</Button>
              </Link>
            )}
          </div>

          <Image
            src="/mascotte/mascotte.png"
            alt=""
            width={220}
            height={294}
            className="pointer-events-none w-24 shrink-0 sm:hidden"
          />
        </div>
      </div>

      <Image
        src="/mascotte/mascotte.png"
        alt=""
        width={220}
        height={294}
        className="pointer-events-none absolute -bottom-4 right-2 hidden w-32 sm:block sm:w-40 md:w-48"
      />
    </div>
  );
}
