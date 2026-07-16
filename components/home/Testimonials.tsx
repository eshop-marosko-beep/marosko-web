import { getTranslations } from "next-intl/server";
import { getHeurekaReviews } from "@/lib/heurekaReviews";
import ReviewCard from "./ReviewCard";
import ReviewsCarousel from "./ReviewsCarousel";

const staticReviewKeys = ["review1", "review2", "review3"] as const;

export default async function Testimonials({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "home.testimonials" });
  const heurekaReviews = await getHeurekaReviews(locale);

  return (
    <section id="referencie" className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-espresso-800 mb-4">{t("title")}</h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">{t("subtitle")}</p>
      </div>
      {heurekaReviews ? (
        <ReviewsCarousel
          reviews={heurekaReviews}
          anonymousLabel={t("anonymous")}
          ratingLabel={(rating) => t("ratingLabel", { rating })}
          badgeLabel={t("verifiedBadge")}
          prevLabel={t("prevReviews")}
          nextLabel={t("nextReviews")}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {staticReviewKeys.map((key) => (
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
      )}
      {heurekaReviews && (
        <p className="text-center text-sm text-gray-400 mt-8">{t("sourceNote")}</p>
      )}
    </section>
  );
}
