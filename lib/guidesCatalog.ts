import { getJson, kv, siteKey } from "@/lib/rental/kv";
import { localized, RENTAL_LOCALES, type LocaleText } from "@/lib/rental/catalog";
import { videos as codeVideos, type Video } from "@/lib/videoData";
import { guideArticles as codeArticles } from "@/lib/guideArticles";
import skMessages from "@/messages/sk.json";
import czMessages from "@/messages/cz.json";
import enMessages from "@/messages/en.json";
import roMessages from "@/messages/ro.json";

/** Guides on /navody: the videos and articles defined in code plus the ones
 * the admin adds in the admin panel. The admin can change the texts and
 * links of every video; articles added in the admin are simple (title,
 * short description, text, photo, product link), the two long articles
 * from code stay as they are. */

export { localized, type LocaleText };

export type GuideVideo = {
  slug: string;
  /** Added in the admin panel (can be deleted). */
  custom: boolean;
  source: "file" | "youtube";
  youtubeId?: string;
  /** Self-hosted clip under public/videos/ (code videos only). */
  file?: string;
  duration?: string;
  /** Still image for the card, player and Google. */
  poster: string;
  titles: LocaleText;
  descriptions: LocaleText;
  /** Product or category the "Zobraziť produkty" button opens; may be empty. */
  linkUrl: string;
  linkUrlByLocale: Record<string, string>;
  active: boolean;
};

export type GuideArticleCard = {
  slug: string;
  custom: boolean;
  titles: LocaleText;
  descriptions: LocaleText;
  image: string;
  imageIsCover?: boolean;
};

/** An article written in the admin panel. */
export type CustomArticle = {
  slug: string;
  titles: LocaleText;
  descriptions: LocaleText;
  /** Plain text: blank line = new paragraph, "## " = heading, "- " = bullet. */
  bodies: LocaleText;
  image: string;
  ctaUrl: string;
  active: boolean;
  createdAt: string;
};

type VideoOverride = Partial<Pick<GuideVideo, "titles" | "descriptions" | "linkUrl" | "linkUrlByLocale" | "poster" | "youtubeId" | "active">>;
type CustomVideo = Omit<GuideVideo, "custom" | "source" | "file" | "duration"> & { createdAt: string };

const messagesByLocale = { sk: skMessages, cz: czMessages, en: enMessages, ro: roMessages };

function codeText(namespace: "videos" | "guideArticles", translationKey: string, field: string): LocaleText {
  const text = (locale: keyof typeof messagesByLocale) => {
    const items = messagesByLocale[locale][namespace].items as Record<string, Record<string, unknown>>;
    const value = items[translationKey]?.[field];
    return typeof value === "string" ? value : "";
  };
  return { sk: text("sk"), cz: text("cz"), en: text("en"), ro: text("ro") };
}

export function youTubePoster(youtubeId: string): string {
  return `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;
}

function fromCode(video: Video, o: VideoOverride): GuideVideo {
  const youtube = video.source === "youtube";
  return {
    slug: video.slug,
    custom: false,
    source: video.source,
    youtubeId: youtube ? (o.youtubeId ?? video.youtubeId) : undefined,
    file: youtube ? undefined : video.file,
    duration: youtube ? undefined : video.duration,
    poster: o.poster ?? (youtube ? video.poster : `/videos/${video.file}.webp`),
    titles: o.titles ?? codeText("videos", video.translationKey, "title"),
    descriptions: o.descriptions ?? codeText("videos", video.translationKey, "description"),
    linkUrl: o.linkUrl ?? video.linkUrl,
    linkUrlByLocale: o.linkUrlByLocale ?? video.linkUrlByLocale ?? {},
    active: o.active ?? true,
  };
}

/** For changes: a read error must stop the save, never overwrite the stored
 * list with an empty one. */
async function strictJson<T>(k: string, fallback: T): Promise<T> {
  return (await getJson<T>(k)) ?? fallback;
}

async function safeJson<T>(k: string, fallback: T): Promise<T> {
  try {
    return (await getJson<T>(k)) ?? fallback;
  } catch (error) {
    // The guides page must not go down with the database; code content still shows.
    console.error("Guides content read failed", error);
    return fallback;
  }
}

/** Every video, newest admin videos first, then the ones from code. */
export async function getGuideVideos(): Promise<GuideVideo[]> {
  const [overrides, custom] = await Promise.all([
    safeJson<Record<string, VideoOverride>>(siteKey("videos"), {}),
    safeJson<CustomVideo[]>(siteKey("customvideos"), []),
  ]);
  return [
    ...[...custom]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .map((v) => ({ ...v, custom: true, source: "youtube" as const })),
    ...codeVideos.map((video) => fromCode(video, overrides[video.slug] ?? {})),
  ];
}

export async function getGuideVideo(slug: string): Promise<GuideVideo | undefined> {
  return (await getGuideVideos()).find((video) => video.slug === slug);
}

export async function getCustomArticles(): Promise<CustomArticle[]> {
  const articles = await safeJson<CustomArticle[]>(siteKey("articles"), []);
  return [...articles].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** Article cards for /navody: admin articles first, then the ones from code. */
export async function getGuideArticleCards(): Promise<GuideArticleCard[]> {
  const custom = (await getCustomArticles()).filter((a) => a.active);
  return [
    ...custom.map(({ slug, titles, descriptions, image }) => ({ slug, custom: true, titles, descriptions, image })),
    ...codeArticles.map((a) => ({
      slug: a.slug,
      custom: false,
      titles: codeText("guideArticles", a.translationKey, "title"),
      descriptions: codeText("guideArticles", a.translationKey, "cardDescription"),
      image: a.image,
      imageIsCover: a.imageIsCover,
    })),
  ];
}

/** "Zobraziť produkty" target for a locale; "" when the video has none. */
export function guideLinkUrl(video: Pick<GuideVideo, "linkUrl" | "linkUrlByLocale">, locale: string): string {
  return video.linkUrlByLocale[locale] || video.linkUrl;
}

/** Splits an admin article into blocks for rendering. */
export function articleBlocks(text: string): ({ type: "h2" | "p"; text: string } | { type: "ul"; items: string[] })[] {
  return text
    .replace(/\r\n/g, "\n")
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      if (block.startsWith("## ")) return { type: "h2" as const, text: block.slice(3).trim() };
      const lines = block.split("\n");
      if (lines.every((line) => line.trim().startsWith("- "))) {
        return { type: "ul" as const, items: lines.map((line) => line.trim().slice(2).trim()) };
      }
      return { type: "p" as const, text: block };
    });
}

/* ---------- Admin edits ---------- */

function text(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function localeText(value: unknown, max: number): LocaleText | null {
  const input = (value ?? {}) as Record<string, unknown>;
  const sk = text(input.sk, max);
  if (!sk) return null;
  const result: LocaleText = { sk };
  for (const locale of RENTAL_LOCALES) {
    const t = text(input[locale], max);
    if (locale !== "sk" && t) result[locale] = t;
  }
  return result;
}

/** "" (no link), an https address or a path on this site. */
function link(value: unknown): string | null {
  const url = text(value, 500);
  return url === "" || /^https:\/\/\S+$/.test(url) || /^\/[\w\-/#?=&.]*$/.test(url) ? url : null;
}

function image(value: unknown): string | null {
  const url = text(value, 500);
  return /^\/api\/rental\/image\/[A-Za-z0-9_-]+$/.test(url) || /^https:\/\/\S+$/.test(url) || /^\/[\w/.-]+$/.test(url) ? url : null;
}

/** Accepts a YouTube link in any common form, or the bare video id. */
export function parseYouTubeId(value: unknown): string | null {
  const input = text(value, 300);
  if (/^[A-Za-z0-9_-]{11}$/.test(input)) return input;
  const match = /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/|v\/))([A-Za-z0-9_-]{11})/.exec(input);
  return match ? match[1] : null;
}

function slugify(name: string): string {
  return (
    name
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 70) || "navod"
  );
}

function uniqueSlug(base: string, taken: Set<string>): string {
  let slug = base;
  for (let i = 2; taken.has(slug); i++) slug = `${base}-${i}`;
  return slug;
}

export type SaveResult = { ok: true; slug: string } | { ok: false; error: string };

export async function saveVideo(slug: string, input: Record<string, unknown>): Promise<SaveResult> {
  const titles = localeText(input.titles, 200);
  const descriptions = localeText(input.descriptions, 2000);
  if (!titles) return { ok: false, error: "guide_title" };
  if (!descriptions) return { ok: false, error: "guide_description" };
  const linkUrl = link(input.linkUrl);
  const linkCz = link(input.linkUrlCz);
  const linkRo = link(input.linkUrlRo);
  if (linkUrl === null || linkCz === null || linkRo === null) return { ok: false, error: "guide_link" };
  const linkUrlByLocale: Record<string, string> = {};
  if (linkCz) linkUrlByLocale.cz = linkCz;
  if (linkRo) linkUrlByLocale.ro = linkRo;
  const active = input.active !== false;
  const posterInput = text(input.poster, 500);
  const poster = posterInput ? image(posterInput) : "";
  if (poster === null) return { ok: false, error: "guide_image" };

  const code = codeVideos.find((v) => v.slug === slug);
  if (code) {
    const overrides = await strictJson<Record<string, VideoOverride>>(siteKey("videos"), {});
    const override: VideoOverride = { titles, descriptions, linkUrl, linkUrlByLocale, active };
    if (code.source === "youtube") {
      const youtubeId = parseYouTubeId(input.youtube);
      if (!youtubeId) return { ok: false, error: "guide_youtube" };
      override.youtubeId = youtubeId;
      override.poster = poster || code.poster;
    } else if (poster) {
      override.poster = poster;
    }
    overrides[slug] = override;
    await kv(["SET", siteKey("videos"), JSON.stringify(overrides)]);
    return { ok: true, slug };
  }

  const youtubeId = parseYouTubeId(input.youtube);
  if (!youtubeId) return { ok: false, error: "guide_youtube" };
  const custom = await strictJson<CustomVideo[]>(siteKey("customvideos"), []);
  const video = { titles, descriptions, linkUrl, linkUrlByLocale, active, youtubeId, poster: poster || youTubePoster(youtubeId) };
  if (slug) {
    const index = custom.findIndex((v) => v.slug === slug);
    if (index < 0) return { ok: false, error: "guide_unknown" };
    custom[index] = { ...custom[index], ...video };
  } else {
    const taken = new Set([...codeVideos.map((v) => v.slug), ...custom.map((v) => v.slug), "clanky"]);
    slug = uniqueSlug(slugify(titles.sk), taken);
    custom.push({ slug, ...video, createdAt: new Date().toISOString() });
  }
  await kv(["SET", siteKey("customvideos"), JSON.stringify(custom)]);
  return { ok: true, slug };
}

export async function deleteVideo(slug: string): Promise<boolean> {
  const custom = await strictJson<CustomVideo[]>(siteKey("customvideos"), []);
  const rest = custom.filter((v) => v.slug !== slug);
  if (rest.length === custom.length) return false;
  await kv(["SET", siteKey("customvideos"), JSON.stringify(rest)]);
  return true;
}

export async function saveArticle(slug: string, input: Record<string, unknown>): Promise<SaveResult> {
  const titles = localeText(input.titles, 200);
  const descriptions = localeText(input.descriptions, 400);
  const bodies = localeText(input.bodies, 30_000);
  if (!titles) return { ok: false, error: "guide_title" };
  if (!descriptions) return { ok: false, error: "guide_description" };
  if (!bodies) return { ok: false, error: "guide_body" };
  const img = image(input.image);
  if (!img) return { ok: false, error: "guide_image" };
  const ctaUrl = link(input.ctaUrl);
  if (ctaUrl === null) return { ok: false, error: "guide_link" };

  const articles = await strictJson<CustomArticle[]>(siteKey("articles"), []);
  const fields = { titles, descriptions, bodies, image: img, ctaUrl, active: input.active !== false };
  if (slug) {
    const index = articles.findIndex((a) => a.slug === slug);
    if (index < 0) return { ok: false, error: "guide_unknown" };
    articles[index] = { ...articles[index], ...fields };
  } else {
    const taken = new Set([...codeArticles.map((a) => a.slug), ...articles.map((a) => a.slug)]);
    slug = uniqueSlug(slugify(titles.sk), taken);
    articles.push({ slug, ...fields, createdAt: new Date().toISOString() });
  }
  await kv(["SET", siteKey("articles"), JSON.stringify(articles)]);
  return { ok: true, slug };
}

export async function deleteArticle(slug: string): Promise<boolean> {
  const articles = await strictJson<CustomArticle[]>(siteKey("articles"), []);
  const rest = articles.filter((a) => a.slug !== slug);
  if (rest.length === articles.length) return false;
  await kv(["SET", siteKey("articles"), JSON.stringify(rest)]);
  return true;
}

export function videoTitle(video: Pick<GuideVideo, "titles">, locale: string): string {
  return localized(video.titles, locale);
}
