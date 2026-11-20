/* Daily sync of the shop's stock (store G1-138) into Google Merchant Center as
 * local inventory, so products show "in stock at the store" on Google.
 *
 * Runs in GitHub Actions (.github/workflows/merchant-sync-local-inventory.yml),
 * not on Vercel: it used to be a Vercel cron route, but there it counted
 * against the Hobby plan's limits and was capped at 300 s, so not every
 * product got refreshed in one run.
 *
 * Needs GOOGLE_SERVICE_ACCOUNT_KEY and BIZNISWEB_API_TOKEN (GitHub secrets).
 * Run locally with: node scripts/merchant/sync-local-inventory.ts */

import { JWT } from "google-auth-library";

const MERCHANT_ACCOUNT_ID = "5365276597";
const STORE_CODE = "G1-138";
const CONTENT_LANGUAGE = "sk";
const FEED_LABEL = "SK";
const FLOX_GRAPHQL_URL = "https://eshop.marosko.sk/api/graphql";

const FLOX_BATCH_SIZE = 10;
const FLOX_BATCH_DELAY_MS = 200;
const FLOX_MAX_RETRIES = 3;
const FLOX_RETRY_BASE_DELAY_MS = 500;

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Chýba env premenná ${name}`);
  return value;
}

function getAuthClient() {
  const credentials = JSON.parse(requireEnv("GOOGLE_SERVICE_ACCOUNT_KEY"));
  return new JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ["https://www.googleapis.com/auth/content"],
  });
}

type ReportRow = { productView?: { id?: string; offerId?: string } };

// reports:search is paginated; follow nextPageToken so no product is missed.
async function searchReport(authClient: JWT, query: string) {
  const url = `https://merchantapi.googleapis.com/reports/v1/accounts/${MERCHANT_ACCOUNT_ID}/reports:search`;
  const rows: ReportRow[] = [];
  let pageToken: string | undefined;

  do {
    const res = await authClient.request({
      url,
      method: "POST",
      data: { query, pageSize: 1000, ...(pageToken ? { pageToken } : {}) },
    });
    const data = res.data as { results?: ReportRow[]; nextPageToken?: string };
    rows.push(...(data.results ?? []));
    pageToken = data.nextPageToken || undefined;
  } while (pageToken);

  return rows;
}

function getBaseProductId(offerId: string) {
  const underscoreIndex = offerId.indexOf("_");
  return underscoreIndex === -1 ? offerId : offerId.slice(0, underscoreIndex);
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Products created directly in Merchant Center have a UUID id and no
 * counterpart in the e-shop, so there is no stock to look up. */
function isLocalMerchantCenterId(baseId: string) {
  return UUID_REGEX.test(baseId);
}

class FloxHttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function getFloxAvailableQuantity(apiKey: string, productId: string): Promise<number> {
  const res = await fetch(FLOX_GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "BW-API-Key": `Token ${apiKey}`,
    },
    body: JSON.stringify({
      query: `query { getProduct(product_id: "${productId}", lang_code: "SK") { warehouse_items { quantity available_quantity } } }`,
    }),
  });

  const rawBody = await res.text();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let json: any = null;
  try {
    json = JSON.parse(rawBody);
  } catch {
    // response body wasn't JSON — fall through with json === null
  }

  if (!res.ok) {
    const detail = json?.errors
      ? json.errors.map((e: { message: string }) => e.message).join("; ")
      : rawBody.slice(0, 500);
    throw new FloxHttpError(res.status, `Flox HTTP ${res.status} ${res.statusText}: ${detail}`);
  }

  if (json?.errors) {
    throw new Error(
      `Flox GraphQL error: ${json.errors.map((e: { message: string }) => e.message).join("; ")}`
    );
  }

  const product = json?.data?.getProduct;
  if (!product) {
    throw new Error(`Produkt "${productId}" neexistuje vo Flox`);
  }

  const warehouseItems: Array<{ available_quantity?: number }> = product.warehouse_items ?? [];
  return warehouseItems.reduce((sum, item) => sum + (item.available_quantity ?? 0), 0);
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

async function getFloxAvailableQuantityWithRetry(apiKey: string, productId: string): Promise<number> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await getFloxAvailableQuantity(apiKey, productId);
    } catch (err) {
      const isRateLimited = err instanceof FloxHttpError && err.status === 429;
      if (!isRateLimited || attempt >= FLOX_MAX_RETRIES) {
        throw err;
      }
      await sleep(FLOX_RETRY_BASE_DELAY_MS * 2 ** attempt);
    }
  }
}

async function upsertLocalInventory(authClient: JWT, offerId: string, quantity: number) {
  const productName = `${CONTENT_LANGUAGE}~${FEED_LABEL}~${offerId}`;
  const url = `https://merchantapi.googleapis.com/inventories/v1/accounts/${MERCHANT_ACCOUNT_ID}/products/${productName}/localInventories:insert`;

  await authClient.request({
    url,
    method: "POST",
    data: {
      storeCode: STORE_CODE,
      localInventoryAttributes: {
        availability: quantity > 0 ? "IN_STOCK" : "OUT_OF_STOCK",
        quantity,
      },
    },
  });
}

function errorMessage(err: unknown) {
  return err instanceof Error ? err.message : String(err);
}

async function main() {
  const startedAt = Date.now();
  const floxApiKey = requireEnv("BIZNISWEB_API_TOKEN");
  const authClient = getAuthClient();

  const rows = await searchReport(authClient, "SELECT id, offer_id FROM product_view WHERE feed_label = 'SK'");
  const offerIds = rows.map((r) => r.productView?.offerId).filter((id): id is string => Boolean(id));

  // One Flox lookup per base product, shared by all its variants (offers).
  const offersByBaseId = new Map<string, string[]>();
  for (const offerId of offerIds) {
    const baseId = getBaseProductId(offerId);
    const list = offersByBaseId.get(baseId) ?? [];
    list.push(offerId);
    offersByBaseId.set(baseId, list);
  }

  const baseIds = Array.from(offersByBaseId.keys());
  const floxBaseIds = baseIds.filter((id) => !isLocalMerchantCenterId(id));
  const localBaseIds = baseIds.filter((id) => isLocalMerchantCenterId(id));

  console.log(
    "start:",
    JSON.stringify({
      totalOfferIds: offerIds.length,
      floxBaseProducts: floxBaseIds.length,
      localOnlyBaseProducts: localBaseIds.length,
    })
  );

  const floxLookupFailures: Array<{ baseId: string; error: string }> = [];
  const failures: Array<{ offerId: string; error: string }> = [];
  let succeeded = 0;
  let inStock = 0;
  let outOfStock = 0;

  const batches = chunk(floxBaseIds, FLOX_BATCH_SIZE);
  for (let i = 0; i < batches.length; i++) {
    await Promise.all(
      batches[i].map(async (baseId) => {
        let quantity: number;
        try {
          quantity = await getFloxAvailableQuantityWithRetry(floxApiKey, baseId);
        } catch (err) {
          floxLookupFailures.push({ baseId, error: errorMessage(err) });
          return;
        }

        for (const offerId of offersByBaseId.get(baseId) ?? []) {
          try {
            await upsertLocalInventory(authClient, offerId, quantity);
            succeeded++;
            if (quantity > 0) inStock++;
            else outOfStock++;
          } catch (err) {
            failures.push({ offerId, error: errorMessage(err) });
          }
        }
      })
    );

    if (i < batches.length - 1) {
      await sleep(FLOX_BATCH_DELAY_MS);
    }
  }

  const summary = {
    checkedAt: new Date().toISOString(),
    durationMs: Date.now() - startedAt,
    totalOfferIds: offerIds.length,
    floxBaseProducts: floxBaseIds.length,
    localOnlyBaseProducts: localBaseIds.length,
    succeeded,
    inStock,
    outOfStock,
    floxLookupFailed: floxLookupFailures.length,
    failed: failures.length,
  };

  console.log("summary:", JSON.stringify(summary, null, 2));
  if (floxLookupFailures.length > 0) {
    console.log("floxLookupFailures:", JSON.stringify(floxLookupFailures, null, 2));
  }
  if (failures.length > 0) {
    console.log("failures:", JSON.stringify(failures, null, 2));
  }

  const summaryFile = process.env.GITHUB_STEP_SUMMARY;
  if (summaryFile) {
    const { appendFileSync } = await import("node:fs");
    appendFileSync(
      summaryFile,
      [
        "## Merchant Center – skladové zásoby predajne",
        "",
        `- Produkty (ponuky): ${summary.totalOfferIds}`,
        `- Zapísané: ${succeeded} (skladom ${inStock}, nie je skladom ${outOfStock})`,
        `- Nenájdené v e-shope: ${floxLookupFailures.length}`,
        `- Chyba pri zápise: ${failures.length}`,
        `- Trvanie: ${Math.round(summary.durationMs / 1000)} s`,
        "",
      ].join("\n")
    );
  }
}

main().catch((err) => {
  console.error("sync-local-inventory error:", err);
  process.exit(1);
});
