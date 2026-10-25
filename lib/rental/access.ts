import { getCatalog, groupPricing, type CatalogTool } from "@/lib/rental/catalog";
import { canUseTool, DEFAULT_GROUP_ID, findGroup, getGroups, type CustomerGroup } from "@/lib/rental/groups";
import { getCurrentUser, type PublicUser } from "@/lib/rental/users";

export type VisibleTool = CatalogTool & {
  /** Prices and deposit for this visitor: their group's when signed in, the
   * default group's (full price) otherwise. */
  pricing: ReturnType<typeof groupPricing>;
};

export type RentalContext = {
  user: PublicUser | null;
  group: CustomerGroup | null;
  /** Active tools this visitor may see: all of them when signed out, only
   * the group's tools when signed in. Admins see all. */
  tools: VisibleTool[];
  /** Signed in and not blocked, so bookings can be sent. */
  canBook: boolean;
};

export async function getRentalContext(): Promise<RentalContext> {
  const [user, catalog, groups] = await Promise.all([getCurrentUser(), getCatalog(), getGroups()]);
  const active = catalog.filter((tool) => tool.active);
  // Prices and free dates are public, so visitors can decide before they
  // register; only sending a booking needs an account.
  if (!user) {
    const guest = findGroup(groups, DEFAULT_GROUP_ID);
    return { user: null, group: null, canBook: false, tools: active.map((tool) => ({ ...tool, pricing: groupPricing(tool, guest) })) };
  }

  const group = findGroup(groups, user.isAdmin || !user.blocked ? user.groupId : DEFAULT_GROUP_ID);
  const tools = active
    .filter((tool) => user.isAdmin || canUseTool(group, tool.slug))
    .map((tool) => ({ ...tool, pricing: groupPricing(tool, group) }));
  return { user, group, canBook: !user.blocked, tools };
}
