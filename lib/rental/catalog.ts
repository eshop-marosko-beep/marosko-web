import { getJson, key, kv } from "@/lib/rental/kv";
import { rentalTools, type RentalTool } from "@/lib/rental/rentalData";
import type { CustomerGroup } from "@/lib/rental/groups";

/** What the admin can change per tool. Names, descriptions and photos stay
 * in code (they're translated in messages.rental.tools). */
export type ToolSettings = Pick<RentalTool, "prices" | "deposit" | "units"> & { active: boolean };

export type CatalogTool = RentalTool & { active: boolean };

async function getOverrides(): Promise<Record<string, Partial<ToolSettings>>> {
  return (await getJson<Record<string, Partial<ToolSettings>>>(key("tools"))) ?? {};
}

/** Tools with the admin's prices, deposits, unit counts and on/off state. */
export async function getCatalog(): Promise<CatalogTool[]> {
  const overrides = await getOverrides();
  return rentalTools.map((tool) => {
    const o = overrides[tool.slug] ?? {};
    return {
      ...tool,
      prices: { ...tool.prices, ...o.prices },
      deposit: o.deposit ?? tool.deposit,
      units: o.units ?? tool.units,
      active: o.active ?? true,
    };
  });
}

export async function getCatalogTool(slug: string): Promise<CatalogTool | undefined> {
  return (await getCatalog()).find((tool) => tool.slug === slug);
}

function money(value: unknown, fallback: number): number {
  const n = Math.round(Number(value) * 100) / 100;
  return Number.isFinite(n) && n >= 0 && n <= 100_000 ? n : fallback;
}

export async function saveToolSettings(slug: string, input: Record<string, unknown>): Promise<boolean> {
  const tool = rentalTools.find((t) => t.slug === slug);
  if (!tool) return false;
  const prices = (input.prices ?? {}) as Record<string, unknown>;
  const units = Math.round(Number(input.units));
  const settings: ToolSettings = {
    prices: {
      day: money(prices.day, tool.prices.day),
      weekend: money(prices.weekend, tool.prices.weekend),
      week: money(prices.week, tool.prices.week),
    },
    deposit: money(input.deposit, tool.deposit),
    units: Number.isFinite(units) && units >= 1 && units <= 50 ? units : tool.units,
    active: input.active !== false,
  };
  const overrides = await getOverrides();
  overrides[slug] = settings;
  await kv(["SET", key("tools"), JSON.stringify(overrides)]);
  return true;
}

/** Prices and deposit a customer of this group actually pays. */
export function groupPricing(tool: CatalogTool, group: CustomerGroup) {
  const factor = (100 - group.discountPercent) / 100;
  const round = (n: number) => Math.round(n * factor * 100) / 100;
  return {
    prices: { day: round(tool.prices.day), weekend: round(tool.prices.weekend), week: round(tool.prices.week) },
    deposit: Math.round((tool.deposit * group.depositPercent) / 100),
    discountPercent: group.discountPercent,
  };
}
