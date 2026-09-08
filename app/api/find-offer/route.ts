import { NextRequest, NextResponse } from "next/server";
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

async function searchReport(authClient: JWT, query: string) {
  const url = `https://merchantapi.googleapis.com/reports/v1/accounts/${MERCHANT_ACCOUNT_ID}/reports:search`;

  const res = await authClient.request({
    url,
    method: "POST",
    data: { query },
  });

  return res.data;
}

function escapeLikeValue(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

export async function GET(request: NextRequest) {
  try {
    const q = request.nextUrl.searchParams.get("q");
    if (!q) {
      return NextResponse.json(
        { error: "Chýba query parameter 'q'" },
        { status: 400 }
      );
    }

    const escapedQ = escapeLikeValue(q);

    const query = `
      SELECT
        id,
        offer_id,
        title,
        aggregated_reporting_context_status
      FROM product_view
      WHERE offer_id LIKE '${escapedQ}%'
    `.trim();

    const authClient = getAuthClient();
    const report = await searchReport(authClient, query);

    return NextResponse.json({
      checkedAt: new Date().toISOString(),
      q,
      result: report,
    });
  } catch (err) {
    console.error("find-offer error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
