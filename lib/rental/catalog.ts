import { getJson, key, kv } from "@/lib/rental/kv";
import { rentalTools, type RentalTool } from "@/lib/rental/rentalData";
import type { CustomerGroup } from "@/lib/rental/groups";
import skMessages from "@/messages/sk.json";
import czMessages from "@/messages/cz.json";
import enMessages from "@/messages/en.json";
import roMessages from "@/messages/ro.json";

/** The rental catalog: the tools defined in code (rentalData.ts, texts in
 * messages.rental.tools) plus tools the admin adds in the admin panel. The
 * admin can change everything about a tool; code values are only defaults. */

export const RENTAL_LOCALES = ["sk", "cz", "en", "ro"] as const;
export type RentalLocale = (typeof RENTAL_LOCALES)[number];
/** Slovak is required; other languages fall back to it. */
export type LocaleText = { sk: string } & Partial<Record<Exclude<RentalLocale, "sk">, string>>;

type Prices = RentalTool["prices"];

export type CatalogTool = {
  slug: string;
  /** Added in the admin panel (can be deleted) rather than defined in code. */
  custom: boolean;
  names: LocaleText;
  descriptions: LocaleText;
  image: string;
  eshopUrlByLocale?: { sk: string } & Record<string, string>;
  value?: number;
  accessories: string[];
  prices: Prices;
  deposit: number;
  units: number;
  active: boolean;
};

/** Stored for a tool from code: only what the admin changed. */
type Override = Partial<Omit<CatalogTool, "slug" | "custom" | "eshopUrlByLocale">> & { eshopUrl?: string };
/** Stored for a tool added in the admin panel: the whole tool. */
type CustomTool = Omit<CatalogTool, "custom">;

const messagesByLocale: Record<RentalLocale, typeof skMessages> = {
  sk: skMessages,
  cz: czMessages,
  en: enMessages,
  ro: roMessages,
};

function codeText(translationKey: string, field: "name" | "description"): LocaleText {
  const text = (locale: RentalLocale) =>
    (messagesByLocale[locale].rental.tools as Record<string, { name: string; description: string }>)[translationKey]?.[field] ?? "";
  return { sk: text("sk"), cz: text("cz"), en: text("en"), ro: text("ro") };
}

export function localized(text: LocaleText, locale: string): string {
  return (text as Record<string, string | undefined>)[locale] || text.sk;
}

export function toolLabel(tool: Pick<CatalogTool, "names">, locale = "sk"): string {
  return localized(tool.names, locale);
}

export function eshopUrl(tool: Pick<CatalogTool, "eshopUrlByLocale">, locale: string): string | undefined {
  if (!tool.eshopUrlByLocale) return undefined;
  return tool.eshopUrlByLocale[locale] ?? tool.eshopUrlByLocale.sk;
}

async function getOverrides(): Promise<Record<string, Override>> {
  return (await getJson<Record<string, Override>>(key("tools"))) ?? {};
}

async function getCustomTools(): Promise<CustomTool[]> {
  return (await getJson<CustomTool[]>(key("customtools"))) ?? [];
}

function fromCode(tool: RentalTool, o: Override): CatalogTool {
  const defaultEshop = tool.eshopUrlByLocale;
  // A changed eshop link replaces all languages; an unchanged one keeps the
  // CZ/RO links from code.
  const eshopUrlByLocale =
    o.eshopUrl === undefined || o.eshopUrl === defaultEshop?.sk ? defaultEshop : o.eshopUrl ? { sk: o.eshopUrl } : undefined;
  return {
    slug: tool.slug,
    custom: false,
    names: o.names ?? codeText(tool.translationKey, "name"),
    descriptions: o.descriptions ?? codeText(tool.translationKey, "description"),
    image: o.image ?? tool.image,
    eshopUrlByLocale,
    value: o.value ?? tool.value,
    accessories: o.accessories ?? tool.accessories,
    prices: { ...tool.prices, ...o.prices },
    deposit: o.deposit ?? tool.deposit,
    units: o.units ?? tool.units,
    active: o.active ?? true,
  };
}

/** Every tool, active or not, in display order (code tools first). */
export async function getCatalog(): Promise<CatalogTool[]> {
  const [overrides, custom] = await Promise.all([getOverrides(), getCustomTools()]);
  return [
    ...rentalTools.map((tool) => fromCode(tool, overrides[tool.slug] ?? {})),
    ...custom.map((tool) => ({ ...tool, custom: true })),
  ];
}

export async function getCatalogTool(slug: string): Promise<CatalogTool | undefined> {
  return (await getCatalog()).find((tool) => tool.slug === slug);
}

/* ---------- Admin edits ---------- */

function money(value: unknown): number | null {
  const n = Math.round(Number(String(value ?? "").replace(",", ".")) * 100) / 100;
  return String(value ?? "").trim() !== "" && Number.isFinite(n) && n >= 0 && n <= 1_000_000 ? n : null;
}

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

/** Images uploaded in the admin panel, or any https address. */
function imageUrl(value: unknown): string | null {
  const url = text(value, 500);
  return /^\/api\/rental\/image\/[A-Za-z0-9_-]+$/.test(url) || /^https:\/\/\S+$/.test(url) || /^\/[\w/.-]+$/.test(url) ? url : null;
}

export type ToolInput = Record<string, unknown>;
export type SaveToolResult = { ok: true; slug: string } | { ok: false; error: string };

/** Validates the admin's form; null fields mean "not filled in". */
function parse(input: ToolInput) {
  const prices = (input.prices ?? {}) as Record<string, unknown>;
  const units = Math.round(Number(input.units));
  const eshop = text(input.eshopUrl, 500);
  return {
    names: localeText(input.names, 120),
    descriptions: localeText(input.descriptions, 1500),
    image: imageUrl(input.image),
    eshopUrl: eshop === "" ? "" : /^https:\/\/\S+$/.test(eshop) ? eshop : null,
    value: money(input.value),
    accessories: Array.isArray(input.accessories)
      ? input.accessories.map((a) => text(a, 120)).filter(Boolean).slice(0, 30)
      : [],
    prices: { day: money(prices.day), weekend: money(prices.weekend), week: money(prices.week) },
    deposit: money(input.deposit),
    units: Number.isFinite(units) && units >= 1 && units <= 50 ? units : null,
    active: input.active !== false,
  };
}

function slugify(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "naradie";
}

/** Creates a tool (no slug) or updates one (slug of a code or admin tool). */
export async function saveTool(slug: string, input: ToolInput): Promise<SaveToolResult> {
  const p = parse(input);
  if (!p.names) return { ok: false, error: "tool_name" };
  if (!p.descriptions) return { ok: false, error: "tool_description" };
  if (!p.image) return { ok: false, error: "tool_image" };
  if (p.eshopUrl === null) return { ok: false, error: "tool_eshop" };
  const { day, weekend, week } = p.prices;
  if (day === null || weekend === null || week === null || p.deposit === null) return { ok: false, error: "tool_prices" };
  if (p.units === null) return { ok: false, error: "tool_units" };

  const tool: Omit<CustomTool, "slug"> = {
    names: p.names,
    descriptions: p.descriptions,
    image: p.image,
    ...(p.eshopUrl ? { eshopUrlByLocale: { sk: p.eshopUrl } } : {}),
    ...(p.value !== null ? { value: p.value } : {}),
    accessories: p.accessories,
    prices: { day, weekend, week },
    deposit: p.deposit,
    units: p.units,
    active: p.active,
  };

  if (rentalTools.some((t) => t.slug === slug)) {
    const overrides = await getOverrides();
    overrides[slug] = {
      names: tool.names,
      descriptions: tool.descriptions,
      image: tool.image,
      eshopUrl: p.eshopUrl,
      value: tool.value,
      accessories: tool.accessories,
      prices: tool.prices,
      deposit: tool.deposit,
      units: tool.units,
      active: tool.active,
    };
    await kv(["SET", key("tools"), JSON.stringify(overrides)]);
    return { ok: true, slug };
  }

  const custom = await getCustomTools();
  if (slug) {
    const index = custom.findIndex((t) => t.slug === slug);
    if (index < 0) return { ok: false, error: "unknown_tool" };
    custom[index] = { slug, ...tool };
  } else {
    const taken = new Set([...rentalTools.map((t) => t.slug), ...custom.map((t) => t.slug)]);
    const base = slugify(p.names.sk);
    let newSlug = base;
    for (let i = 2; taken.has(newSlug); i++) newSlug = `${base}-${i}`;
    custom.push({ slug: newSlug, ...tool });
    slug = newSlug;
  }
  await kv(["SET", key("customtools"), JSON.stringify(custom)]);
  return { ok: true, slug };
}

/** Removes a tool added in the admin panel. Tools from code can only be hidden. */
export async function deleteCustomTool(slug: string): Promise<boolean> {
  const custom = await getCustomTools();
  const rest = custom.filter((t) => t.slug !== slug);
  if (rest.length === custom.length) return false;
  await kv(["SET", key("customtools"), JSON.stringify(rest)]);
  return true;
}

/** Prices and deposit a customer of this group actually pays. */
export function groupPricing(tool: Pick<CatalogTool, "prices" | "deposit">, group: CustomerGroup) {
  const factor = (100 - group.discountPercent) / 100;
  const round = (n: number) => Math.round(n * factor * 100) / 100;
  return {
    prices: { day: round(tool.prices.day), weekend: round(tool.prices.weekend), week: round(tool.prices.week) },
    deposit: Math.round((tool.deposit * group.depositPercent) / 100),
    discountPercent: group.discountPercent,
  };
}
