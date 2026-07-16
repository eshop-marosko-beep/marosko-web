import { getTranslations } from "next-intl/server";
import { getHeurekaReviews } from "@/lib/heurekaReviews";

const staticReviewKeys = ["review1", "review2", "review3"] as const;

function initials(name: string): string {
  const letters = name
    .split(/[\s-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
  return letters || "?";
}

function StarRating({ rating, label }: { rating: number; label: string }) {
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

function ReviewCard({
  name,
  role,
  text,
  rating,
  ratingLabel,
  badge,
}: {
  name: string;
  role?: string;
  text: string;
  rating: number;
  ratingLabel: string;
  badge?: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-amber-500 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <StarRating rating={rating} label={ratingLabel} />
        {badge && (
          <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full whitespace-nowrap">
            {badge}
          </span>
        )}
      </div>
      <p className="text-gray-700 leading-relaxed mb-5 flex-1">&ldquo;{text}&rdquo;</p>
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-espresso-800 text-cream-50 font-bold text-sm">
          {initials(name)}
        </span>
        <div>
          <p className="font-bold text-espresso-800">{name}</p>
          {role && <p className="text-sm text-gray-500">{role}</p>}
        </div>
      </div>
    </div>
  );
}

export default async function Testimonials({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "home.testimonials" });
  const heurekaReviews = await getHeurekaReviews();

  return (
    <section id="referencie" className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-espresso-800 mb-4">{t("title")}</h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">{t("subtitle")}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {heurekaReviews
          ? heurekaReviews.map((review) => (
              <ReviewCard
                key={review.id}
                name={review.name ?? t("anonymous")}
                text={review.text}
                rating={review.rating}
                ratingLabel={t("ratingLabel", { rating: review.rating })}
                badge={t("verifiedBadge")}
              />
            ))
          : staticReviewKeys.map((key) => (
              <ReviewCard
                key={key}
                name={t(`${key}.name`)}
                role={t(`${key}.role`)}
                text={t(`${key}.text`)}
                rating={5}
                ratingLabel={t("ratingLabel", { rating: 5 })}
              />
            ))}
      </div>
      {heurekaReviews && (
        <p className="text-center text-sm text-gray-400 mt-8">{t("sourceNote")}</p>
      )}
    </section>
  );
}
