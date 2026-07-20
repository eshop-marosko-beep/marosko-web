export type Video = {
  slug: string;
  /** File under public/videos/, without extension. */
  file: string;
  /** Video duration in ISO 8601 form, e.g. "PT38S". */
  duration: string;
  /** Where the "Zobraziť produkty" CTA points. */
  linkUrl: string;
  /** Whether linkUrl is an internal app path (Link) or an external eshop URL (<a>). */
  linkType: "internal" | "external";
  /** i18n key under messages.videos.items.<translationKey>. */
  translationKey: string;
};

export const videos: Video[] = [
  {
    slug: "manpa-multi-cutter-master-konar",
    file: "manpa-multi-cutter-master-konar",
    duration: "PT54S",
    linkUrl: "https://eshop.marosko.sk/p/1029/predlzovacie-rameno-s-predlzenim-frezovanie-manpa-multi-cutter-master",
    linkType: "external",
    translationKey: "manpaMultiCutterMaster",
  },
  {
    slug: "voskovanie-lestenie-tramu",
    file: "voskovanie-lestenie-tramu",
    duration: "PT1M1S",
    linkUrl: "/galeria/selaky-vosky-natery-na-drevo",
    linkType: "internal",
    translationKey: "voskovanieTramu",
  },
  {
    slug: "brusenie-drevenej-sochy-valcom",
    file: "brusenie-drevenej-sochy-valcom",
    duration: "PT25S",
    linkUrl: "/galeria/manpa-predlzovacie-rameno",
    linkType: "internal",
    translationKey: "brusenieSochy",
  },
  {
    slug: "orbi-cut-dlabanie-gulockou",
    file: "orbi-cut-dlabanie-gulockou",
    duration: "PT9S",
    linkUrl: "/galeria/frezovacie-nastroje-do-vrtacky",
    linkType: "internal",
    translationKey: "orbiCut",
  },
  {
    slug: "frezovaci-kotuc-125mm-ostry-kraj",
    file: "frezovaci-kotuc-125mm-ostry-kraj",
    duration: "PT38S",
    linkUrl: "/galeria/frezovacie-kotuce",
    linkType: "internal",
    translationKey: "kotuc125mm",
  },
];
