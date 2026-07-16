import { getTranslations } from "next-intl/server";
import { getHeurekaReviews, type HeurekaReview } from "@/lib/heurekaReviews";

const staticReviewKeys = ["review1", "review2", "review3"] as const;

function StarRating({ rating, label }: { rating: number; label: string }) {
  return (
    <div className="flex gap-0.5 mb-3" role="img" aria-label={label}>
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

function ReviewCard({ review, anonymousLabel, ratingLabel }: {
  review: HeurekaReview;
  anonymousLabel: string;
  ratingLabel: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-amber-500">
      <StarRating rating={review.rating} label={ratingLabel} />
      <p className="text-gray-700 leading-relaxed mb-4">&ldquo;{review.text}&rdquo;</p>
      <p className="font-bold text-espresso-800">{review.name ?? anonymousLabel}</p>
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
                review={review}
                anonymousLabel={t("anonymous")}
                ratingLabel={t("ratingLabel", { rating: review.rating })}
              />
            ))
          : staticReviewKeys.map((key) => (
              <div key={key} className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-amber-500">
                <p className="text-gray-700 leading-relaxed mb-4">&ldquo;{t(`${key}.text`)}&rdquo;</p>
                <p className="font-bold text-espresso-800">{t(`${key}.name`)}</p>
                <p className="text-sm text-gray-500">{t(`${key}.role`)}</p>
              </div>
            ))}
      </div>
      {heurekaReviews && (
        <p className="text-center text-sm text-gray-400 mt-8">{t("sourceNote")}</p>
      )}
    </section>
  );
}
