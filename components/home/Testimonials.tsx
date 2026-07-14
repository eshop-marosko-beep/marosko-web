import { useTranslations } from "next-intl";

const reviews = ["review1", "review2", "review3"] as const;

export default function Testimonials() {
  const t = useTranslations("home.testimonials");

  return (
    <section id="referencie" className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-espresso-800 mb-4">
          {t("title")}
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          {t("subtitle")}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {reviews.map((key) => (
          <div key={key} className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-amber-500">
            <p className="text-gray-700 leading-relaxed mb-4">
              &ldquo;{t(`${key}.text`)}&rdquo;
            </p>
            <p className="font-bold text-espresso-800">{t(`${key}.name`)}</p>
            <p className="text-sm text-gray-500">{t(`${key}.role`)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
