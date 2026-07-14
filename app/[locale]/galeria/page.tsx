import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";

const millingImages = [
  { src: "/gallery/arbortech-industrial-woodcarver.jpg", altKey: "img1" },
  { src: "/gallery/pirana-prano-frezovaci-kotuc.jpg", altKey: "img2" },
  { src: "/gallery/presny-frezovaci-kotuc-8mm.jpg", altKey: "img3" },
  { src: "/gallery/manpa-vymenitelne-noze-95mm.jpg", altKey: "img4" },
  { src: "/gallery/manpa-frezovaci-kotuc-70mm.jpg", altKey: "img5" },
  { src: "/gallery/manpa-sada-velkosti-a.jpg", altKey: "img6" },
  { src: "/gallery/manpa-sada-velkosti-b.jpg", altKey: "img7" },
] as const;

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("gallery");

  return (
    <div className="py-8">
      <h1 className="text-4xl font-bold text-amber-800 mb-4">
        {t("title")}
      </h1>
      <p className="text-gray-600 mb-12">
        {t("description")}
      </p>

      <section>
        <h2 className="text-2xl font-bold text-amber-800 mb-3">
          {t("milling.title")}
        </h2>
        <p className="text-gray-600 leading-relaxed mb-6 max-w-3xl">
          {t("milling.description")}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {millingImages.map(({ src, altKey }) => (
            <div
              key={src}
              className="relative bg-white border border-gray-200 rounded-lg h-40 overflow-hidden"
            >
              <Image
                src={src}
                alt={t(`milling.${altKey}`)}
                fill
                sizes="(min-width: 768px) 20vw, 50vw"
                className="object-contain p-2"
              />
            </div>
          ))}
        </div>
        <a
          href="https://eshop.marosko.sk/c/nastroje-do-uhlovej-brusky/nastroje-do-uhlovych-brusiek-na-drevo/frezovacie-naradie-do-uhlovych-brusok"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors"
        >
          {t("milling.cta")} →
        </a>
      </section>
    </div>
  );
}
