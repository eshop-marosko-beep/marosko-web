import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { blogPosts } from "@/lib/blogData";

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("blog");

  const featured = blogPosts.filter((post) => post.translationKey && post.image);
  const rest = blogPosts.filter((post) => !(post.translationKey && post.image));

  return (
    <div className="py-8 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-espresso-800 mb-4">{t("title")}</h1>
      <p className="text-gray-600 text-lg mb-4 max-w-2xl">{t("subtitle")}</p>
      <p className="text-gray-600 leading-relaxed mb-10 max-w-2xl">{t("intro")}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {featured.map(({ slug, url, image, translationKey }) => (
          <a
            key={slug}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow flex flex-col"
          >
            <div className="relative h-48 bg-cream-100">
              <Image
                src={image!}
                alt={t(`posts.${translationKey}.title`)}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                className="object-contain p-4 group-hover:scale-105 transition-transform"
              />
            </div>
            <div className="p-6 flex flex-col flex-1">
              <h2 className="text-lg font-bold text-espresso-800 mb-2">
                {t(`posts.${translationKey}.title`)}
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1">
                {t(`posts.${translationKey}.description`)}
              </p>
              <span className="text-amber-700 font-semibold">
                {t("readMore")} →
              </span>
            </div>
          </a>
        ))}
      </div>

      <ul className="space-y-3">
        {rest.map(({ slug, title, url }) => (
          <li key={slug}>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white rounded-lg shadow p-4 text-espresso-800 font-semibold hover:text-amber-700 hover:shadow-md transition-all"
            >
              {title} →
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
