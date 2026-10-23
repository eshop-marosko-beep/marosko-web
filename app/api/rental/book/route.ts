import { apiError, locale, readJson, str } from "@/lib/rental/api";
import { createBooking, DATE_RE, todayIso } from "@/lib/rental/bookings";
import { notifyOwner, toolName } from "@/lib/rental/notify";
import { estimatePrice, getRentalTool, rentalDays } from "@/lib/rental/rentalData";
import { getCurrentUser } from "@/lib/rental/users";

const MAX_DAYS = 30;
const MAX_DAYS_AHEAD = 180;

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return apiError("not_signed_in", 401);

  const body = await readJson(request);
  if (!body) return apiError("invalid_request", 400);

  const tool = getRentalTool(str(body.tool));
  if (!tool) return apiError("unknown_tool", 404);

  const from = str(body.from, 10);
  const to = str(body.to, 10);
  const today = todayIso();
  const latest = new Date(Date.now() + MAX_DAYS_AHEAD * 86_400_000).toISOString().slice(0, 10);
  if (!DATE_RE.test(from) || !DATE_RE.test(to) || from > to || from < today || to > latest) {
    return apiError("invalid_dates", 400);
  }
  const days = rentalDays(from, to);
  if (days > MAX_DAYS) return apiError("too_long", 400);

  const result = await createBooking(tool, {
    email: user.email,
    name: user.name,
    phone: user.phone,
    from,
    to,
    days,
    estimatedPrice: estimatePrice(tool, days),
    note: str(body.note, 1000),
    locale: locale(body.locale),
  });
  if (!result.ok) return apiError(result.reason === "taken" ? "dates_taken" : "try_again", 409);

  try {
    await notifyOwner(result.booking, toolName(tool.slug, tool.translationKey), new URL(request.url).origin);
  } catch (error) {
    // The booking is stored and visible in the customer's account; a failed
    // email must not make the customer think the request was lost.
    console.error("Rental owner email failed", error);
  }

  return Response.json({ success: true, id: result.booking.id });
}
