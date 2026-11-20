import { NextResponse } from "next/server";

/** The Merchant Center diagnostic routes (/api/find-offer,
 * /api/list-data-sources, /api/check-listings-settings) act as the shop's
 * Google service account, so they must not be public. Call them with
 * `Authorization: Bearer <MERCHANT_API_TOKEN>`. Without the env variable
 * set, they stay locked. Returns a 401 response, or null when allowed. */
export function rejectUnlessMerchantToken(request: Request): NextResponse | null {
  const token = process.env.MERCHANT_API_TOKEN;
  if (!token || request.headers.get("authorization") !== `Bearer ${token}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
