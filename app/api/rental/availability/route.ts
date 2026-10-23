import { apiError } from "@/lib/rental/api";
import { activeToolBookings, fullyBookedDays } from "@/lib/rental/bookings";
import { getRentalTool } from "@/lib/rental/rentalData";
import { getCurrentUser } from "@/lib/rental/users";

/** Fully booked days of one tool, for the booking calendar. */
export async function GET(request: Request) {
  if (!(await getCurrentUser())) return apiError("not_signed_in", 401);

  const tool = getRentalTool(new URL(request.url).searchParams.get("tool") ?? "");
  if (!tool) return apiError("unknown_tool", 404);

  const bookedDays = fullyBookedDays(await activeToolBookings(tool.slug), tool.units);
  return Response.json({ success: true, bookedDays }, { headers: { "Cache-Control": "no-store" } });
}
