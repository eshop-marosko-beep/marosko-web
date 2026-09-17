import { NextResponse } from "next/server";
import { JWT } from "google-auth-library";

const MERCHANT_ACCOUNT_ID = "5365276597";

function getAuthClient() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!raw) {
    throw new Error("Chýba env premenná GOOGLE_SERVICE_ACCOUNT_KEY");
  }
  const credentials = JSON.parse(raw);

  return new JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ["https://www.googleapis.com/auth/content"],
  });
}

async function tryGet(authClient: JWT, url: string) {
  try {
    const res = await authClient.request({ url, method: "GET" });
    return { ok: true, data: res.data };
  } catch (err: any) {
    return {
      ok: false,
      status: err?.response?.status ?? null,
      error: err?.response?.data ?? (err instanceof Error ? err.message : "Unknown error"),
    };
  }
}

export async function GET() {
  try {
    const authClient = getAuthClient();

    const [shippingSettings, returnPolicies, productReviews, merchantReviews] = await Promise.all([
      tryGet(authClient, `https://merchantapi.googleapis.com/accounts/v1/accounts/${MERCHANT_ACCOUNT_ID}/shippingSettings`),
      tryGet(authClient, `https://merchantapi.googleapis.com/accounts/v1/accounts/${MERCHANT_ACCOUNT_ID}/onlineReturnPolicies`),
      tryGet(authClient, `https://merchantapi.googleapis.com/reviews/v1beta/accounts/${MERCHANT_ACCOUNT_ID}/productReviews`),
      tryGet(authClient, `https://merchantapi.googleapis.com/reviews/v1beta/accounts/${MERCHANT_ACCOUNT_ID}/merchantReviews`),
    ]);

    return NextResponse.json({
      checkedAt: new Date().toISOString(),
      shippingSettings,
      returnPolicies,
      productReviews,
      merchantReviews,
    });
  } catch (err) {
    console.error("check-listings-settings error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
