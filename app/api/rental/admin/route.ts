import { apiError, EMAIL_RE, readJson, str } from "@/lib/rental/api";
import { createBooking, DATE_RE, getBooking, setBookingStatus, toolBookings } from "@/lib/rental/bookings";
import { getCatalog, getCatalogTool, groupPricing, saveToolSettings } from "@/lib/rental/catalog";
import { DEFAULT_GROUP_ID, findGroup, getGroups, sanitizeGroup, saveGroups } from "@/lib/rental/groups";
import { notifyCustomer, toolName } from "@/lib/rental/notify";
import { estimatePrice, rentalDays, rentalTools } from "@/lib/rental/rentalData";
import { getCurrentUser, getUser, listUsers, normalizeEmail, saveUser, toPublicUser } from "@/lib/rental/users";

/** Admin panel data and actions. Every request must come from a signed-in
 * admin (see lib/rental/users.ts for how an account becomes admin). */

async function requireAdmin() {
  const user = await getCurrentUser();
  return user?.isAdmin ? user : null;
}

export async function GET() {
  if (!(await requireAdmin())) return apiError("forbidden", 403);

  const [catalog, groups, users] = await Promise.all([getCatalog(), getGroups(), listUsers()]);
  const bookings = (await Promise.all(catalog.map((tool) => toolBookings(tool.slug))))
    .flat()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 300);

  return Response.json(
    {
      success: true,
      tools: catalog.map((tool) => ({
        slug: tool.slug,
        name: toolName(tool.slug, tool.translationKey),
        prices: tool.prices,
        deposit: tool.deposit,
        units: tool.units,
        active: tool.active,
      })),
      groups,
      customers: users.map((user) => ({ ...toPublicUser(user), createdAt: user.createdAt })),
      bookings,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return apiError("forbidden", 403);

  const body = await readJson(request);
  if (!body) return apiError("invalid_request", 400);
  const knownTools = rentalTools.map((tool) => tool.slug);

  switch (body.action) {
    case "setBookingStatus": {
      const status = body.status;
      if (status !== "confirmed" && status !== "declined" && status !== "cancelled") return apiError("invalid_request", 400);
      const booking = await getBooking(str(body.id, 40));
      if (!booking) return apiError("not_found", 404);
      const updated = await setBookingStatus(booking.id, status);
      if (updated && updated.kind !== "block" && status !== "cancelled") {
        const tool = rentalTools.find((t) => t.slug === updated.toolSlug);
        try {
          await notifyCustomer(updated, tool ? toolName(tool.slug, tool.translationKey, updated.locale) : updated.toolSlug);
        } catch (error) {
          console.error("Rental customer email failed", error);
        }
      }
      return Response.json({ success: true });
    }

    case "addBlock": {
      const tool = await getCatalogTool(str(body.tool));
      const from = str(body.from, 10);
      const to = str(body.to, 10);
      if (!tool || !DATE_RE.test(from) || !DATE_RE.test(to) || from > to) return apiError("invalid_dates", 400);
      const result = await createBooking(tool, {
        kind: "block",
        email: admin.email,
        name: "Blokované správcom",
        phone: "",
        from,
        to,
        days: rentalDays(from, to),
        estimatedPrice: 0,
        deposit: 0,
        note: str(body.reason, 200),
        locale: "sk",
        status: "confirmed",
      });
      if (!result.ok) return apiError(result.reason === "taken" ? "dates_taken" : "try_again", 409);
      return Response.json({ success: true });
    }

    case "addShopBooking": {
      // A customer who came to the shop: confirmed straight away, priced by
      // their group (their account's group if the e-mail has one).
      const tool = await getCatalogTool(str(body.tool));
      const from = str(body.from, 10);
      const to = str(body.to, 10);
      if (!tool || !DATE_RE.test(from) || !DATE_RE.test(to) || from > to) return apiError("invalid_dates", 400);
      const name = str(body.name, 100);
      const phone = str(body.phone, 30);
      const email = normalizeEmail(str(body.email, 200));
      if (!name || !phone || (email && !EMAIL_RE.test(email))) return apiError("invalid_customer", 400);

      const account = email ? await getUser(email) : null;
      const groups = await getGroups();
      const group = findGroup(groups, account?.groupId ?? (str(body.groupId, 40) || DEFAULT_GROUP_ID));
      const pricing = groupPricing(tool, group);
      const days = rentalDays(from, to);
      // A price agreed at the counter (family, friends) replaces the price list.
      const agreed = (value: unknown) => {
        const n = Number.parseFloat(str(value, 20).replace(",", "."));
        return Number.isFinite(n) && n >= 0 ? Math.round(n * 100) / 100 : null;
      };
      const agreedPrice = agreed(body.price);
      const agreedDeposit = agreed(body.deposit);
      const result = await createBooking(tool, {
        kind: "booking",
        source: "shop",
        email,
        name,
        phone,
        from,
        to,
        days,
        estimatedPrice: agreedPrice ?? estimatePrice(pricing, from, to),
        deposit: agreedDeposit ?? pricing.deposit,
        groupId: group.id,
        discountPercent: pricing.discountPercent,
        note: str(body.note, 500),
        locale: "sk",
        status: "confirmed",
        decidedAt: new Date().toISOString(),
      });
      if (!result.ok) return apiError(result.reason === "taken" ? "dates_taken" : "try_again", 409);
      return Response.json({ success: true, id: result.booking.id });
    }

    case "setCustomer": {
      const user = await getUser(normalizeEmail(str(body.email)));
      if (!user) return apiError("not_found", 404);
      const groups = await getGroups();
      if (typeof body.groupId === "string") {
        if (!groups.some((group) => group.id === body.groupId)) return apiError("invalid_request", 400);
        user.groupId = body.groupId;
      }
      if (typeof body.blocked === "boolean") user.blocked = body.blocked;
      await saveUser(user);
      return Response.json({ success: true });
    }

    case "saveGroup": {
      const group = sanitizeGroup((body.group ?? {}) as Record<string, unknown>, knownTools);
      if (!group) return apiError("invalid_fields", 400);
      const groups = await getGroups();
      const index = groups.findIndex((g) => g.id === group.id);
      if (index >= 0) groups[index] = group;
      else groups.push(group);
      await saveGroups(groups);
      return Response.json({ success: true });
    }

    case "deleteGroup": {
      const id = str(body.id, 40);
      if (id === DEFAULT_GROUP_ID) return apiError("invalid_request", 400);
      // Customers of a deleted group fall back to the default group.
      await saveGroups((await getGroups()).filter((group) => group.id !== id));
      return Response.json({ success: true });
    }

    case "saveTool": {
      const saved = await saveToolSettings(str(body.slug), body);
      return saved ? Response.json({ success: true }) : apiError("unknown_tool", 404);
    }

    default:
      return apiError("invalid_request", 400);
  }
}
