type VideoBase = {
  slug: string;
  /** Where the "Zobraziť produkty" CTA points. */
  linkUrl: string;
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
    linkType: "external",
    translationKey: "arbortechBallGouge",
  },
  {
    source: "file",
    slug: "manpa-multi-cutter-master-konar",
    file: "manpa-multi-cutter-master-konar",
    duration: "PT54S",
    linkUrl: "https://eshop.marosko.sk/p/1029/predlzovacie-rameno-s-predlzenim-frezovanie-manpa-multi-cutter-master",
    linkType: "external",
    translationKey: "manpaMultiCutterMaster",
  },
  {
    source: "file",
    slug: "arbortech-contour-sander-tram",
    file: "arbortech-contour-sander-tram",
    duration: "PT1M1S",
    linkUrl: "https://eshop.marosko.sk/p/370/smirkovaci-nastavec-contour-sander-sada-arbortech",
    linkType: "external",
    translationKey: "arbortechContourSander",
  },
  {
    source: "file",
    slug: "lesticka-sada-brusenie-sochy",
    file: "lesticka-sada-brusenie-sochy",
    duration: "PT25S",
    linkUrl: "https://eshop.marosko.sk/p/968/lestica-sada-hridel-12cm-kotuc-30cm",
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
    linkType: "external",
    translationKey: "rasplovyKotucOstryKraj",
  },
  {
    source: "youtube",
    slug: "arbortech-spheroplane",
    youtubeId: "4D5aO8ol96E",
    poster: "https://eshop.marosko.sk/resize/e/1200/630/files/na-drevo/arbortech/sphero-plane/arbortech-spheroplane-gallery-1.jpg",
    linkUrl: "https://eshop.marosko.sk/p/1338/arbortech-sphero-plane-frezovaci-nastavec",
    linkType: "external",
    translationKey: "arbortechSpheroPlane",
  },
  {
    source: "youtube",
    slug: "arbortech-power-chisel",
    youtubeId: "Mi4rfU106P0",
    poster: "https://eshop.marosko.sk/resize/e/1200/630/files/na-drevo/arbortech/power-cisel-7-dielna-sada/power-chisel-pack.jpg",
    linkUrl: "https://eshop.marosko.sk/p/838/elektricke-dlato-arbortech-power-chisel-7-dielna-sada",
    linkType: "external",
    translationKey: "arbortechPowerChisel",
  },
  {
    source: "youtube",
    slug: "arbortech-mini-carver",
    youtubeId: "98mfo2EUdGo",
    poster: "https://eshop.marosko.sk/resize/e/1200/630/files/elektricke-naradie/arbortech-novinka/mini-carver/mini-carver-nova-1000w.png",
    linkUrl: "https://eshop.marosko.sk/p/196/elektricka-frezka-arbortech-mini-carver",
    linkType: "external",
    translationKey: "arbortechMiniCarver",
  },
  {
    source: "youtube",
    slug: "arbortech-turbo-scraper",
    youtubeId: "NkYq0SqF5O0",
    poster: "https://eshop.marosko.sk/resize/e/1200/630/files/na-drevo/arbortech/arbortech-skrabka/arbortech-turbo-scraper-complet.jpg",
    linkUrl: "https://eshop.marosko.sk/p/1303/arbortech-turbo-scraper-100-mm",
    linkType: "external",
    translationKey: "arbortechTurboScraper",
  },
  {
    source: "youtube",
    slug: "arbortech-power-carving-unit",
    youtubeId: "Tsd2flxWC94",
    poster: "https://eshop.marosko.sk/resize/e/1200/630/files/na-drevo/arbortech/arbortech-power-carving-unit/img-1229-copy-copy-2.jpg",
    linkUrl: "https://eshop.marosko.sk/p/743/arbortech-power-carving-unit-brusny-komplet",
    linkType: "external",
    translationKey: "arbortechPowerCarvingUnit",
  },
  {
    source: "youtube",
    slug: "socha-podla-predlohy-lesticka-sada",
    youtubeId: "-6F279ng5Qo",
    poster: "https://eshop.marosko.sk/resize/e/1200/630/files/na-velke-projekty/kotuc-do-lesticky.jpg",
    linkUrl: "https://eshop.marosko.sk/p/968/lestica-sada-hridel-12cm-kotuc-30cm",
    linkType: "external",
    translationKey: "sochaPodlaPredlohy",
  },
  {
    source: "youtube",
    slug: "manpa-multi-cutter-master-sada",
    youtubeId: "GOM9lPK7-s0",
    poster: "https://eshop.marosko.sk/resize/e/1200/630/files/manpa/master/2.jpg",
    linkUrl: "https://eshop.marosko.sk/p/1029/predlzovacie-rameno-s-predlzenim-frezovanie-manpa-multi-cutter-master",
    linkType: "external",
    translationKey: "manpaMultiCutterMasterSada",
  },
  {
    source: "youtube",
    slug: "manpa-multi-cutter-predlzovacie-rameno",
    youtubeId: "wOrxQ1y40FY",
    poster: "https://eshop.marosko.sk/resize/e/1200/630/files/na-drevo/do-uhlovych-brusok/predlzovaci-rameno-/multi-cutter-mp21-bez-frezky.jpeg",
    linkUrl: "https://eshop.marosko.sk/p/789/predlzovacie-rameno-s-viacucelovym-nadstavcom-manpa",
    linkType: "external",
    translationKey: "manpaMultiCutterRameno",
  },
];

export function getVideo(slug: string) {
  return videos.find((video) => video.slug === slug);
}

/** Still image for cards, og:image, sitemaps and VideoObject.thumbnailUrl. */
export function videoThumbnail(video: Video): string {
  return video.source === "file" ? `/videos/${video.file}.webp` : video.poster;
}

/** Privacy-enhanced embed URL (no YouTube cookies until playback). */
export function youTubeEmbedUrl(youtubeId: string): string {
  return `https://www.youtube-nocookie.com/embed/${youtubeId}`;
}
