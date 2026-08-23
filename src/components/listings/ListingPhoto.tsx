import Image from "next/image";
import { PhotoPlaceholder } from "./PhotoPlaceholder";
import { clsx } from "@/lib/clsx";

export function ListingPhoto({
  photoUrl,
  emoji,
  className,
  alt,
}: {
  photoUrl?: string | null;
  emoji: string;
  className?: string;
  alt: string;
}) {
  if (photoUrl) {
    return (
      <div className={clsx("relative overflow-hidden", className)}>
        <Image src={photoUrl} alt={alt} fill sizes="400px" className="object-cover" />
      </div>
    );
  }

  return <PhotoPlaceholder emoji={emoji} className={className} />;
}
