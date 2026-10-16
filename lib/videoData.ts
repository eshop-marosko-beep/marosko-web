type VideoBase = {
  slug: string;
  /** Where the "Zobraziť produkty" CTA points. */
  linkUrl: string;
  /** The same eshop page in another language version (eshop.marosko.sk/cz,
   * /ro), keyed by site locale. Locales without an entry ("sk", and "en",
   * which the eshop has no version for) fall back to linkUrl. */
  linkUrlByLocale?: Record<string, string>;
  /** Whether linkUrl is an internal app path (Link) or an external eshop URL (<a>). */
  linkType: "internal" | "external";
  /** i18n key under messages.videos.items.<translationKey>. */
  translationKey: string;
};

/** A clip we recorded ourselves and host under public/videos/. */
export type FileVideo = VideoBase & {
  source: "file";
  /** File under public/videos/, without extension. */
  file: string;
  /** Video duration in ISO 8601 form, e.g. "PT38S". */
  duration: string;
};

/** A public video on YouTube (e.g. the manufacturer's own product demo),
 * embedded rather than re-hosted. */
export type YouTubeVideo = VideoBase & {
  source: "youtube";
  youtubeId: string;
  /** Product photo from eshop.marosko.sk shown until the visitor presses
   * play, so no request goes to YouTube before then. */
  poster: string;
};

export type Video = FileVideo | YouTubeVideo;

export const videos: Video[] = [
  {
    source: "file",
    slug: "arbortech-ball-gouge",
    file: "arbortech-ball-gouge",
    duration: "PT18S",
    linkUrl: "https://eshop.marosko.sk/p/255/tvarovacia-gulicka-arbortech-ball-gouge",
    linkUrlByLocale: {
      cz: "https://eshop.marosko.sk/cz/p/255/arbortech-hoblovaci-kulicka-ball-gouge",
      ro: "https://eshop.marosko.sk/ro/p/255/sfera-sculptura-lemn-ball-gouge-arbortech-30mm",
    },
    linkType: "external",
    translationKey: "arbortechBallGouge",
  },
  {
    source: "file",
    slug: "manpa-multi-cutter-master-konar",
    file: "manpa-multi-cutter-master-konar",
    duration: "PT54S",
    linkUrl: "https://eshop.marosko.sk/p/1029/predlzovacie-rameno-s-predlzenim-frezovanie-manpa-multi-cutter-master",
    linkUrlByLocale: {
      cz: "https://eshop.marosko.sk/cz/p/1029/manpa-multi-cutter-master-prodluzovaci-rameno-s-prodlouzenim-a-nahradni-frezkou",
      ro: "https://eshop.marosko.sk/ro/p/1029/manpa-multi-cutter-master-kit",
    },
    linkType: "external",
    translationKey: "manpaMultiCutterMaster",
  },
  {
    source: "file",
    slug: "arbortech-contour-sander-tram",
    file: "arbortech-contour-sander-tram",
    duration: "PT1M1S",
    linkUrl: "https://eshop.marosko.sk/p/370/smirkovaci-nastavec-contour-sander-sada-arbortech",
    linkUrlByLocale: {
      cz: "https://eshop.marosko.sk/cz/p/370/arbortech-random-contour-sander-sada",
      ro: "https://eshop.marosko.sk/ro/p/370/sistem-excentric-slefuire-sculptura-lemn-arbortech",
    },
    linkType: "external",
    translationKey: "arbortechContourSander",
  },
  {
    source: "file",
    slug: "lesticka-sada-brusenie-sochy",
    file: "lesticka-sada-brusenie-sochy",
    duration: "PT25S",
    linkUrl: "https://eshop.marosko.sk/p/968/lestica-sada-hridel-12cm-kotuc-30cm",
    linkUrlByLocale: {
      cz: "https://eshop.marosko.sk/cz/p/968/lestici-sada-do-lesticky-hridel-12cm-s-lesticim-30cm-kotoucem",
      ro: "https://eshop.marosko.sk/ro/p/968/atasament-set-disc-de-slefuire-30-cm-cu-ax-pentru-flex",
    },
    linkType: "external",
    translationKey: "lesticaSada",
  },
  {
    source: "file",
    slug: "orbi-cut-dlabanie-gulockou",
    file: "orbi-cut-dlabanie-gulockou",
    duration: "PT9S",
    linkUrl: "/galeria/frezovacie-nastroje-do-vrtacky",
    linkType: "internal",
    translationKey: "orbiCut",
  },
  {
    source: "file",
    slug: "rasplovy-kotuc-125mm-ostry-kraj",
    file: "rasplovy-kotuc-125mm-ostry-kraj",
    duration: "PT38S",
    linkUrl: "https://eshop.marosko.sk/p/215/kotucova-sekana-raspla-s-ostrym-krajom-125-mm",
    linkUrlByLocale: {
      cz: "https://eshop.marosko.sk/cz/p/215/kotoucova-sekana-rasple-s-ostrym-krajem125-mm",
      ro: "https://eshop.marosko.sk/ro/p/215/disc-raspel-in-flex-125-mm-profil-v",
    },
    linkType: "external",
    translationKey: "rasplovyKotucOstryKraj",
  },
  {
    source: "youtube",
    slug: "arbortech-spheroplane",
    youtubeId: "4D5aO8ol96E",
    poster: "https://eshop.marosko.sk/resize/e/1200/630/files/na-drevo/arbortech/sphero-plane/arbortech-spheroplane-gallery-1.jpg",
    linkUrl: "https://eshop.marosko.sk/p/1338/arbortech-sphero-plane-frezovaci-nastavec",
    linkUrlByLocale: {
      cz: "https://eshop.marosko.sk/cz/p/1338/arbortech-spheroplane-frezovaci-nastavec-se-systemem-brouseni",
      ro: "https://eshop.marosko.sk/ro/p/1338/arbortech-spheroplane-set-sculptura-pentru-flex",
    },
    linkType: "external",
    translationKey: "arbortechSpheroPlane",
  },
  {
    source: "youtube",
    slug: "arbortech-power-chisel",
    youtubeId: "Mi4rfU106P0",
    poster: "https://eshop.marosko.sk/resize/e/1200/630/files/na-drevo/arbortech/power-cisel-7-dielna-sada/power-chisel-pack.jpg",
    linkUrl: "https://eshop.marosko.sk/p/838/elektricke-dlato-arbortech-power-chisel-7-dielna-sada",
    linkUrlByLocale: {
      cz: "https://eshop.marosko.sk/cz/p/838/elektricke-dlato-arbortech-power-chisel-7-dilna-sada-novinka-1000w",
      ro: "https://eshop.marosko.sk/ro/p/838/dalta-arbortech-power-chisel",
    },
    linkType: "external",
    translationKey: "arbortechPowerChisel",
  },
  {
    source: "youtube",
    slug: "arbortech-mini-carver",
    youtubeId: "98mfo2EUdGo",
    poster: "https://eshop.marosko.sk/resize/e/1200/630/files/elektricke-naradie/arbortech-novinka/mini-carver/mini-carver-nova-1000w.png",
    linkUrl: "https://eshop.marosko.sk/p/196/elektricka-frezka-arbortech-mini-carver",
    linkUrlByLocale: {
      cz: "https://eshop.marosko.sk/cz/p/196/elektricka-frezka-mini-carver-1000w-arbortech",
      ro: "https://eshop.marosko.sk/ro/p/196/polizor-sculptura-arbortech-mini-carver",
    },
    linkType: "external",
    translationKey: "arbortechMiniCarver",
  },
  {
    source: "youtube",
    slug: "arbortech-turbo-scraper",
    youtubeId: "NkYq0SqF5O0",
    poster: "https://eshop.marosko.sk/resize/e/1200/630/files/na-drevo/arbortech/arbortech-skrabka/arbortech-turbo-scraper-complet.jpg",
    linkUrl: "https://eshop.marosko.sk/p/1303/arbortech-turbo-scraper-100-mm",
    linkUrlByLocale: {
      cz: "https://eshop.marosko.sk/cz/p/1303/hrubovaci-kotouc-arbortech",
      ro: "https://eshop.marosko.sk/ro/p/1303/arbortech-turbo-scarper-100-mm",
    },
    linkType: "external",
    translationKey: "arbortechTurboScraper",
  },
  {
    source: "youtube",
    slug: "arbortech-power-carving-unit",
    youtubeId: "Tsd2flxWC94",
    poster: "https://eshop.marosko.sk/resize/e/1200/630/files/na-drevo/arbortech/arbortech-power-carving-unit/img-1229-copy-copy-2.jpg",
    linkUrl: "https://eshop.marosko.sk/p/743/arbortech-power-carving-unit-brusny-komplet",
    linkUrlByLocale: {
      cz: "https://eshop.marosko.sk/cz/p/743/arbortech-power-carving-unit1000w",
      ro: "https://eshop.marosko.sk/ro/p/743/arbortech-power-carving-unit",
    },
    linkType: "external",
    translationKey: "arbortechPowerCarvingUnit",
  },
  {
    source: "youtube",
    slug: "socha-podla-predlohy-lesticka-sada",
    youtubeId: "-6F279ng5Qo",
    poster: "https://eshop.marosko.sk/resize/e/1200/630/files/na-velke-projekty/kotuc-do-lesticky.jpg",
    linkUrl: "https://eshop.marosko.sk/p/968/lestica-sada-hridel-12cm-kotuc-30cm",
    linkUrlByLocale: {
      cz: "https://eshop.marosko.sk/cz/p/968/lestici-sada-do-lesticky-hridel-12cm-s-lesticim-30cm-kotoucem",
      ro: "https://eshop.marosko.sk/ro/p/968/atasament-set-disc-de-slefuire-30-cm-cu-ax-pentru-flex",
    },
    linkType: "external",
    translationKey: "sochaPodlaPredlohy",
  },
  {
    source: "youtube",
    slug: "manpa-multi-cutter-master-sada",
    youtubeId: "GOM9lPK7-s0",
    poster: "https://eshop.marosko.sk/resize/e/1200/630/files/manpa/master/2.jpg",
    linkUrl: "https://eshop.marosko.sk/p/1029/predlzovacie-rameno-s-predlzenim-frezovanie-manpa-multi-cutter-master",
    linkUrlByLocale: {
      cz: "https://eshop.marosko.sk/cz/p/1029/manpa-multi-cutter-master-prodluzovaci-rameno-s-prodlouzenim-a-nahradni-frezkou",
      ro: "https://eshop.marosko.sk/ro/p/1029/manpa-multi-cutter-master-kit",
    },
    linkType: "external",
    translationKey: "manpaMultiCutterMasterSada",
  },
  {
    source: "youtube",
    slug: "manpa-multi-cutter-predlzovacie-rameno",
    youtubeId: "wOrxQ1y40FY",
    poster: "https://eshop.marosko.sk/resize/e/1200/630/files/na-drevo/do-uhlovych-brusok/predlzovaci-rameno-/multi-cutter-mp21-bez-frezky.jpeg",
    linkUrl: "https://eshop.marosko.sk/p/789/predlzovacie-rameno-s-viacucelovym-nadstavcom-manpa",
    linkUrlByLocale: {
      cz: "https://eshop.marosko.sk/cz/p/789/prodluzovaci-rameno-s-viceucelovym-nastavcem-bez-kotouce",
      ro: "https://eshop.marosko.sk/ro/p/789/manpa-multi-cutter-fara-disc",
    },
    linkType: "external",
    translationKey: "manpaMultiCutterRameno",
  },
  {
    source: "youtube",
    slug: "saburrtooth-ihlickove-rasple-uhlova-bruska",
    youtubeId: "nGL3Jke0JMU",
    poster: "https://eshop.marosko.sk/resize/e/1200/630/files/na-drevo/do-uhlovych-brusok/brusne/saburr-usa/detail.jpg",
    linkUrl: "https://eshop.marosko.sk/c/nastroje-do-uhlovej-brusky/nastroje-do-uhlovych-brusiek-na-drevo/brusne-kotuce-na-drevo/ihlickove-brusne-kotuce",
    linkUrlByLocale: {
      cz: "https://eshop.marosko.sk/cz/c/nastroje-do-uhlovej-brusky/nastroje-do-uhlovych-brusiek-na-drevo/brusne-kotuce-na-drevo/ihlickove-brusne-kotuce",
      ro: "https://eshop.marosko.sk/ro/c/discuri-pentru-sculpta-in-polizor/saburrtooth-usa",
    },
    linkType: "external",
    translationKey: "saburrtoothIhlickoveRasple",
  },
];

export function getVideo(slug: string) {
  return videos.find((video) => video.slug === slug);
}

/** Where the "Zobraziť produkty" CTA points for the given site locale. */
export function videoLinkUrl(video: Video, locale: string): string {
  return video.linkUrlByLocale?.[locale] ?? video.linkUrl;
}

/** Still image for cards, og:image, sitemaps and VideoObject.thumbnailUrl. */
export function videoThumbnail(video: Video): string {
  return video.source === "file" ? `/videos/${video.file}.webp` : video.poster;
}

/** Privacy-enhanced embed URL (no YouTube cookies until playback). */
export function youTubeEmbedUrl(youtubeId: string): string {
  return `https://www.youtube-nocookie.com/embed/${youtubeId}`;
}
