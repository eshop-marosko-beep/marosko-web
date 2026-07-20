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
    slug: "arbortech-contour-sander-tram",
    file: "arbortech-contour-sander-tram",
    duration: "PT1M1S",
    linkUrl: "https://eshop.marosko.sk/p/370/smirkovaci-nastavec-contour-sander-sada-arbortech",
    linkType: "external",
    translationKey: "arbortechContourSander",
  },
  {
    slug: "lesticka-sada-brusenie-sochy",
    file: "lesticka-sada-brusenie-sochy",
    duration: "PT25S",
    linkUrl: "https://eshop.marosko.sk/p/968/lestica-sada-hridel-12cm-kotuc-30cm",
    linkType: "external",
    translationKey: "lesticaSada",
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
    slug: "rasplovy-kotuc-125mm-ostry-kraj",
    file: "rasplovy-kotuc-125mm-ostry-kraj",
    duration: "PT38S",
    linkUrl: "https://eshop.marosko.sk/p/215/kotucova-sekana-raspla-s-ostrym-krajom-125-mm",
    linkType: "external",
    translationKey: "rasplovyKotucOstryKraj",
  },
];
