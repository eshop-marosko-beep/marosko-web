import { apiError, locale, readJson, str } from "@/lib/rental/api";
import { createBooking, DATE_RE, todayIso } from "@/lib/rental/bookings";
import { getCatalogTool, groupPricing } from "@/lib/rental/catalog";
import { canUseTool, findGroup, getGroups } from "@/lib/rental/groups";
import { notifyCustomer, notifyOwner, toolName } from "@/lib/rental/notify";
import { estimatePrice, rentalDays } from "@/lib/rental/rentalData";
import { getCurrentUser } from "@/lib/rental/users";

const MAX_DAYS = 30;
const MAX_DAYS_AHEAD = 180;

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return apiError("not_signed_in", 401);
  if (user.blocked) return apiError("blocked", 403);

  const body = await readJson(request);
  if (!body) return apiError("invalid_request", 400);

  const tool = await getCatalogTool(str(body.tool));
  if (!tool || !tool.active) return apiError("unknown_tool", 404);
  const group = findGroup(await getGroups(), user.groupId);
  if (!canUseTool(group, tool.slug)) return apiError("tool_not_allowed", 403);

  const from = str(body.from, 10);
  const to = str(body.to, 10);
  const today = todayIso();
  const latest = new Date(Date.now() + MAX_DAYS_AHEAD * 86_400_000).toISOString().slice(0, 10);
  if (!DATE_RE.test(from) || !DATE_RE.test(to) || from > to || from < today || to > latest) {
    return apiError("invalid_dates", 400);
  }
  const days = rentalDays(from, to);
  if (days > MAX_DAYS) return apiError("too_long", 400);

  const pricing = groupPricing(tool, group);
  const result = await createBooking(tool, {
    kind: "booking",
    email: user.email,
    name: user.name,
    phone: user.phone,
    from,
    to,
    days,
    estimatedPrice: estimatePrice(pricing, from, to),
    deposit: pricing.deposit,
    groupId: group.id,
    discountPercent: group.discountPercent,
    note: str(body.note, 1000),
    locale: locale(body.locale),
    status: group.autoConfirm ? "confirmed" : "pending",
  });
  if (!result.ok) return apiError(result.reason === "taken" ? "dates_taken" : "try_again", 409);

  const label = toolName(tool.slug, tool.translationKey);
  try {
    await notifyOwner(result.booking, label, new URL(request.url).origin);
    if (result.booking.status === "confirmed") {
      await notifyCustomer(result.booking, toolName(tool.slug, tool.translationKey, result.booking.locale));
    }
  } catch (error) {
    // The booking is stored and visible in the customer's account; a failed
    // email must not make the customer think the request was lost.
    console.error("Rental booking email failed", error);
  }

  return Response.json({ success: true, id: result.booking.id, status: result.booking.status });
}
