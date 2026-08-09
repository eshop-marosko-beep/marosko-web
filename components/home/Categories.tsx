import { Link } from "@/navigation";
import { useLocale, useTranslations } from "next-intl";

const items = [
  { key: "milling", icon: "⚙️" },
  {
    key: "hand",
    icon: "🔧",
    externalUrl: "https://eshop.marosko.sk/c/rucne-naradie",
    externalUrlRo: "https://eshop.marosko.sk/ro/c/unelte-manuale",
  },
  { key: "power", icon: "🔌" },
] as const;

export default function Categories() {
  const t = useTranslations("home.categories");
  const locale = useLocale();

  return (
    <section id="kategorie" className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-espresso-800 mb-4">
          {t("title")}
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          {t("subtitle")}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {items.map(({ key, icon, ...rest }) => {
          const externalUrl =
            "externalUrl" in rest
              ? locale === "ro" && "externalUrlRo" in rest
                ? rest.externalUrlRo
                : rest.externalUrl
              : undefined;
          const className =
            "block bg-white rounded-xl shadow-lg p-8 text-center border border-transparent hover:border-amber-200 hover:shadow-xl transition-all";
          const content = (
            <>
              <div className="text-5xl mb-4">{icon}</div>
              <h3 className="text-xl font-bold text-espresso-800 mb-3">
                {t(`${key}.name`)}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {t(`${key}.description`)}
              </p>
            </>
          );

          return externalUrl ? (
            <a key={key} href={externalUrl} target="_blank" rel="noopener noreferrer" className={className}>
              {content}
            </a>
          ) : (
            <Link key={key} href="/kategorie" className={className}>
              {content}
            </Link>
          );
        })}
      </div>
      <div className="text-center mt-10">
        <Link
          href="/kategorie"
          className="inline-block bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors"
        >
          {t("cta")}
        </Link>
      </div>
    </section>
  );
}
