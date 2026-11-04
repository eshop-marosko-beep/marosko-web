import { apiError, readJson } from "@/lib/rental/api";
import { isPreviewDeployment } from "@/lib/rental/preview";
import { getCurrentUser } from "@/lib/rental/users";
import { xAction, xOverview } from "@/lib/xHandlers";

/** Admin page data and actions for the X connection. */

async function requireAdmin() {
  if (isPreviewDeployment()) return null;
  const user = await getCurrentUser();
  return user?.isAdmin ? user : null;
}

export async function GET() {
  if (!(await requireAdmin())) return apiError("forbidden", 403);
  return xOverview();
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) return apiError("forbidden", 403);
  const body = await readJson(request);
  if (!body) return apiError("invalid_request", 400);
  return xAction(body, { allowDisconnect: true });
}
