/* Daily list of products Google Merchant Center did not approve, with the
 * reasons. Runs in GitHub Actions (.github/workflows/merchant-report-issues.yml)
 * and writes the list to the run's summary page; it used to be a Vercel cron
 * route whose response nobody saw.
 *
 * Needs GOOGLE_SERVICE_ACCOUNT_KEY (GitHub secret).
 * Run locally with: node scripts/merchant/report-issues.ts */

import { JWT } from "google-auth-library";

const MERCHANT_ACCOUNT_ID = "5365276597";

type ProductView = {
  id?: string;
  offerId?: string;
  title?: string;
  aggregatedReportingContextStatus?: string;
  itemIssues?: Array<{ type?: { code?: string }; severity?: unknown; resolution?: string }>;
};

function getAuthClient() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!raw) throw new Error("Chýba env premenná GOOGLE_SERVICE_ACCOUNT_KEY");
  const credentials = JSON.parse(raw);
  return new JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ["https://www.googleapis.com/auth/content"],
  });
}

async function main() {
  const authClient = getAuthClient();
  const url = `https://merchantapi.googleapis.com/reports/v1/accounts/${MERCHANT_ACCOUNT_ID}/reports:search`;
  const query = `
    SELECT id, offer_id, title, aggregated_reporting_context_status, item_issues
    FROM product_view
    WHERE aggregated_reporting_context_status != 'ELIGIBLE'
  `.trim();

  const items: ProductView[] = [];
  let pageToken: string | undefined;
  do {
    const res = await authClient.request({
      url,
      method: "POST",
      data: { query, pageSize: 1000, ...(pageToken ? { pageToken } : {}) },
    });
    const data = res.data as { results?: Array<{ productView?: ProductView }>; nextPageToken?: string };
    for (const row of data.results ?? []) if (row.productView) items.push(row.productView);
    pageToken = data.nextPageToken || undefined;
  } while (pageToken);

  console.log(`Neschválené produkty: ${items.length}`);
  console.log(JSON.stringify(items, null, 2));

  const summaryFile = process.env.GITHUB_STEP_SUMMARY;
  if (summaryFile) {
    const { appendFileSync } = await import("node:fs");
    const escape = (s: string) => s.replace(/\|/g, "\\|").replace(/\n/g, " ");
    const lines = [`## Merchant Center – neschválené produkty: ${items.length}`, ""];
    if (items.length > 0) {
      lines.push("| Produkt | Stav | Problémy |", "|---|---|---|");
      for (const item of items) {
        const issues = (item.itemIssues ?? []).map((i) => i.type?.code ?? "?").join(", ");
        lines.push(
          `| ${escape(item.title ?? item.offerId ?? item.id ?? "?")} (${escape(item.offerId ?? "")}) | ${escape(
            item.aggregatedReportingContextStatus ?? ""
          )} | ${escape(issues)} |`
        );
      }
    }
    appendFileSync(summaryFile, lines.join("\n") + "\n");
  }
}

main().catch((err) => {
  console.error("report-issues error:", err);
  process.exit(1);
});
