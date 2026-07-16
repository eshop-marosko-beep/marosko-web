import { useTranslations } from "next-intl";

const items = ["years", "brands", "shipping", "freeShipping"] as const;

export default function StatsBar() {
  const t = useTranslations("stats");

  return (
    <section className="py-10">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-y-6 sm:gap-y-8 divide-y divide-amber-100 sm:divide-y-0">
        {items.map((key, index) => (
          <div
            key={key}
            className={`text-center px-2 sm:px-4 min-w-0 ${index > 0 ? "sm:border-l sm:border-amber-100" : ""}`}
          >
            <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-amber-600 whitespace-nowrap">
              {t(`${key}.value`)}
            </p>
            <p className="text-sm md:text-base text-gray-600 mt-2">{t(`${key}.label`)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
