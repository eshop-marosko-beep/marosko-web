import { NextResponse } from "next/server";
import { JWT } from "google-auth-library";

const MERCHANT_ACCOUNT_ID = "5365276597";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const NOTIFY_EMAIL_TO = process.env.NOTIFY_EMAIL_TO ?? "eshop.marosko@gmail.com";
const NOTIFY_EMAIL_FROM = process.env.NOTIFY_EMAIL_FROM ?? "onboarding@resend.dev";

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

  return res.data as {
    results?: Array<{
      productView?: {
        id?: string;
        offerId?: string;
        title?: string;
        aggregatedReportingContextStatus?: string;
        itemIssues?: Array<{
          code?: string;
          description?: string;
          detail?: string;
        }>;
      };
    }>;
  };
}

export async function GET() {
  try {
    const authClient = getAuthClient();

    const query = `
      SELECT
        id,
        offer_id,
        title,
        aggregated_reporting_context_status,
        item_issues
      FROM product_view
      WHERE aggregated_reporting_context_status != 'ELIGIBLE'
    `.trim();

    const report = await searchReport(authClient, query);
    const problematic = report.results ?? [];

    if (problematic.length > 0 && RESEND_API_KEY) {
      const rows = problematic
        .slice(0, 50)
        .map((r) => {
          const pv = r.productView;
          const issues =
            pv?.itemIssues?.map((i) => i.description).join(", ") ?? "?";
          return `<tr><td>${pv?.offerId ?? pv?.id ?? ""}</td><td>${
            pv?.title ?? ""
          }</td><td>${issues}</td></tr>`;
        })
        .join("");

      const html = `
        <h2>Merchant Center: ${problematic.length} produktov s problémom</h2>
        <table border="1" cellpadding="6" cellspacing="0">
          <tr><th>Offer ID</th><th>Názov</th><th>Problém</th></tr>
          ${rows}
        </table>
      `;

      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: NOTIFY_EMAIL_FROM,
          to: [NOTIFY_EMAIL_TO],
          subject: `⚠️ Merchant Center: ${problematic.length} produktov s problémom`,
          html,
        }),
      });
    }

    return NextResponse.json({
      checkedAt: new Date().toISOString(),
      totalIssues: problematic.length,
      items: problematic,
    });
  } catch (err) {
    console.error("sync-merchant error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
