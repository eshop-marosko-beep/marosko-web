import Image from "next/image";

// Always visible (not hover-only) so touch users on phones — who can't hover —
// can tell the image is tappable to open at full size.
function ZoomHint() {
  return (
    <span className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-espresso-800/70 text-white group-hover:bg-espresso-800/90 transition-colors">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
        <circle cx="11" cy="11" r="7" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
        <line x1="11" y1="8" x2="11" y2="14" />
        <line x1="8" y1="11" x2="14" y2="11" />
      </svg>
    </span>
  );
}

type ZoomableImageProps = {
  src: string;
  alt: string;
  /** Translated "Open image in full size" label, used for aria-label/title. */
  openLabel: string;
  /** Container sizing classes, e.g. "relative h-64 md:h-80 rounded-xl overflow-hidden mb-6 bg-cream-100". */
  className: string;
  imageClassName?: string;
  priority?: boolean;
};

/** A product/category photo that opens its own full-resolution file in a new tab when
 * tapped, with an always-visible zoom-icon badge — so touch users (who have no hover
 * state to reveal a hint) can tell the image is enlargeable. */
export default function ZoomableImage({
  src,
  alt,
  openLabel,
  className,
  imageClassName = "object-contain p-6",
  priority,
}: ZoomableImageProps) {
  return (
    <a
      href={src}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={openLabel}
      title={openLabel}
      className={`group ${className}`}
    >
      <Image src={src} alt={alt} fill unoptimized className={imageClassName} priority={priority} />
      <ZoomHint />
    </a>
  );
}
