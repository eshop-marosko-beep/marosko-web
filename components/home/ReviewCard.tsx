function initials(name: string): string {
  const letters = name
    .split(/[\s-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
  return letters || "?";
}

export function StarRating({ rating, label }: { rating: number; label: string }) {
  return (
    <div className="flex gap-0.5 text-lg" role="img" aria-label={label}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={rating >= i + 1 ? "text-amber-500" : "text-gray-300"}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function ReviewCard({
  name,
  anonymousLabel,
  role,
  text,
  rating,
  ratingLabel,
  badgeLabel,
}: {
  /** The real reviewer name from Heureka, or null when the review is anonymous. */
  name: string | null;
  /** Fallback label shown when `name` is null. */
  anonymousLabel?: string;
  role?: string;
  text: string;
  rating: number;
  ratingLabel: string;
  badgeLabel?: string;
}) {
  const displayName = name ?? anonymousLabel ?? "";
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-amber-500 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <StarRating rating={rating} label={ratingLabel} />
        {badgeLabel && (
          <span
            role="img"
            aria-label={badgeLabel}
            title={badgeLabel}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-bold"
          >
            H
          </span>
        )}
      </div>
      <p className="text-gray-700 leading-relaxed mb-5 flex-1">&ldquo;{text}&rdquo;</p>
      <div className="flex items-center gap-3">
        {name && (
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-espresso-800 text-cream-50 font-bold text-sm">
            {initials(name)}
          </span>
        )}
        <div>
          <p className="font-bold text-espresso-800">{displayName}</p>
          {role && <p className="text-sm text-gray-500">{role}</p>}
        </div>
      </div>
    </div>
  );
}
