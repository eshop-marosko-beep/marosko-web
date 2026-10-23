import { getCatalog, groupPricing, type CatalogTool } from "@/lib/rental/catalog";
import { canUseTool, findGroup, getGroups, type CustomerGroup } from "@/lib/rental/groups";
import { getCurrentUser, type PublicUser } from "@/lib/rental/users";

export type VisibleTool = CatalogTool & {
  /** This customer's prices and deposit; null when signed out or blocked. */
  pricing: ReturnType<typeof groupPricing> | null;
};

export type RentalContext = {
  user: PublicUser | null;
  group: CustomerGroup | null;
  /** Active tools this visitor may see: all of them when signed out (as a
   * preview), only the group's tools when signed in. Admins see all. */
  tools: VisibleTool[];
};

export async function getRentalContext(): Promise<RentalContext> {
  const [user, catalog, groups] = await Promise.all([getCurrentUser(), getCatalog(), getGroups()]);
  const active = catalog.filter((tool) => tool.active);
  if (!user) return { user: null, group: null, tools: active.map((tool) => ({ ...tool, pricing: null })) };

  const group = findGroup(groups, user.groupId);
  const tools = active
    .filter((tool) => user.isAdmin || canUseTool(group, tool.slug))
    .map((tool) => ({ ...tool, pricing: user.blocked ? null : groupPricing(tool, group) }));
  return { user, group, tools };
}
