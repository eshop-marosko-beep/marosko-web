import { apiError } from "@/lib/rental/api";
import { activeToolBookings, fullyBookedDays } from "@/lib/rental/bookings";
import { getCatalogTool } from "@/lib/rental/catalog";
import { canUseTool, findGroup, getGroups } from "@/lib/rental/groups";
import { getCurrentUser } from "@/lib/rental/users";

/** Fully booked days of one tool, for the booking calendar. */
export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) return apiError("not_signed_in", 401);
  if (user.blocked) return apiError("blocked", 403);

  const tool = await getCatalogTool(new URL(request.url).searchParams.get("tool") ?? "");
  if (!tool || !tool.active) return apiError("unknown_tool", 404);
  if (!user.isAdmin && !canUseTool(findGroup(await getGroups(), user.groupId), tool.slug)) {
    return apiError("tool_not_allowed", 403);
  }

  const bookedDays = fullyBookedDays(await activeToolBookings(tool.slug), tool.units);
  return Response.json({ success: true, bookedDays }, { headers: { "Cache-Control": "no-store" } });
}
