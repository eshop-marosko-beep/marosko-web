import { getJson, key, kv } from "@/lib/rental/kv";

/** A customer group. The admin edits these; until then the defaults below
 * apply. */
export type CustomerGroup = {
  id: string;
  name: string;
  /** Discount on the rental price, 0–100. */
  discountPercent: number;
  /** Share of the tool's deposit the group pays, 0–100 (0 = no deposit). */
  depositPercent: number;
  /** Bookings are confirmed at once instead of waiting for the shop. */
  autoConfirm: boolean;
  /** Tools the group may see and book; null = all tools. */
  allowedTools: string[] | null;
};

/** New customers land here; it can't be deleted. */
export const DEFAULT_GROUP_ID = "bezny";

export const DEFAULT_GROUPS: CustomerGroup[] = [
  { id: DEFAULT_GROUP_ID, name: "Bežný zákazník", discountPercent: 0, depositPercent: 100, autoConfirm: false, allowedTools: null },
  { id: "staly", name: "Stály zákazník", discountPercent: 10, depositPercent: 50, autoConfirm: false, allowedTools: null },
  { id: "firma", name: "Firma / profesionál", discountPercent: 20, depositPercent: 0, autoConfirm: true, allowedTools: null },
];

export async function getGroups(): Promise<CustomerGroup[]> {
  const stored = await getJson<CustomerGroup[]>(key("groups"));
  const groups = stored && stored.length ? stored : DEFAULT_GROUPS;
  // The default group must always exist, even if it was saved without it.
  return groups.some((group) => group.id === DEFAULT_GROUP_ID) ? groups : [DEFAULT_GROUPS[0], ...groups];
}

export async function saveGroups(groups: CustomerGroup[]): Promise<void> {
  await kv(["SET", key("groups"), JSON.stringify(groups)]);
}

export function findGroup(groups: CustomerGroup[], id: string | undefined): CustomerGroup {
  return groups.find((group) => group.id === id) ?? groups.find((group) => group.id === DEFAULT_GROUP_ID)!;
}

export function canUseTool(group: CustomerGroup, slug: string): boolean {
  return group.allowedTools === null || group.allowedTools.includes(slug);
}

function clampPercent(value: unknown): number {
  const n = Math.round(Number(value));
  return Number.isFinite(n) ? Math.min(100, Math.max(0, n)) : 0;
}

/** Validates a group coming from the admin panel. */
export function sanitizeGroup(input: Record<string, unknown>, knownTools: string[]): CustomerGroup | null {
  const id = typeof input.id === "string" ? input.id.trim().toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 40) : "";
  const name = typeof input.name === "string" ? input.name.trim().slice(0, 80) : "";
  if (!id || !name) return null;
  const allowedTools = Array.isArray(input.allowedTools)
    ? input.allowedTools.filter((slug): slug is string => typeof slug === "string" && knownTools.includes(slug))
    : null;
  return {
    id,
    name,
    discountPercent: clampPercent(input.discountPercent),
    depositPercent: clampPercent(input.depositPercent),
    autoConfirm: input.autoConfirm === true,
    allowedTools,
  };
}
