import { NextResponse } from "next/server";
import { JWT } from "google-auth-library";

const MERCHANT_ACCOUNT_ID = "5365276597";
const STORE_CODE = "G1-138";
const CONTENT_LANGUAGE = "sk";
const FEED_LABEL = "SK";
const FLOX_GRAPHQL_URL = "https://eshop.marosko.sk/api/graphql";

// Vercel Hobby caps functions at 300 s. The run stops starting new batches
// after RUN_BUDGET_MS so it always returns (and logs) instead of timing out.
export const maxDuration = 300;
const RUN_BUDGET_MS = 240_000;

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

function getFloxApiKey() {
  const key = process.env.BIZNISWEB_API_TOKEN;
  if (!key) {
    throw new Error("Chýba env premenná BIZNISWEB_API_TOKEN");
  }
  return key;
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

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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

async function getFloxAvailableQuantity(productId: string): Promise<number> {
  const res = await fetch(FLOX_GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "BW-API-Key": `Token ${getFloxApiKey()}`,
    },
    body: JSON.stringify({
      query: `query { getProduct(product_id: "${productId}", lang_code: "SK") { warehouse_items { quantity available_quantity } } }`,
    }),
  });

  const rawBody = await res.text();
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
    throw new FloxHttpError(
      res.status,
      `Flox HTTP ${res.status} ${res.statusText}: ${detail}`
    );
  }

  if (json?.errors) {
    throw new Error(
      `Flox GraphQL error: ${json.errors
        .map((e: { message: string }) => e.message)
        .join("; ")}`
    );
  }

  const product = json?.data?.getProduct;
  if (!product) {
    throw new Error(`Produkt "${productId}" neexistuje vo Flox`);
  }

  const warehouseItems: Array<{ available_quantity?: number }> =
    product.warehouse_items ?? [];

  return warehouseItems.reduce(
    (sum, item) => sum + (item.available_quantity ?? 0),
    0
  );
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

const FLOX_BATCH_SIZE = 10;
const FLOX_BATCH_DELAY_MS = 200;
const FLOX_MAX_RETRIES = 3;
const FLOX_RETRY_BASE_DELAY_MS = 500;

async function getFloxAvailableQuantityWithRetry(
  productId: string
): Promise<number> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await getFloxAvailableQuantity(productId);
    } catch (err) {
      const isRateLimited = err instanceof FloxHttpError && err.status === 429;
      if (!isRateLimited || attempt >= FLOX_MAX_RETRIES) {
        throw err;
      }
      await sleep(FLOX_RETRY_BASE_DELAY_MS * 2 ** attempt);
    }
  }
}

async function upsertLocalInventory(
  authClient: JWT,
  offerId: string,
  quantity: number
) {
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

// Fisher–Yates shuffle: when a run hits RUN_BUDGET_MS the products it skips
// differ from day to day, so every product still gets refreshed regularly.
function shuffle<T>(items: T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function errorMessage(err: unknown) {
  return err instanceof Error ? err.message : String(err);
}

export async function GET(request: Request) {
  // Vercel Cron (and the dashboard "Run" button) send this header when
  // CRON_SECRET is set, so random visitors can't trigger the sync.
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startedAt = Date.now();

  try {
    const authClient = getAuthClient();

    const rows = await searchReport(
      authClient,
      "SELECT id, offer_id FROM product_view WHERE feed_label = 'SK'"
    );
    const offerIds = rows
      .map((r) => r.productView?.offerId)
      .filter((id): id is string => Boolean(id));

    // One Flox lookup per base product, shared by all its variants (offers).
    const offersByBaseId = new Map<string, string[]>();
    for (const offerId of offerIds) {
      const baseId = getBaseProductId(offerId);
      const list = offersByBaseId.get(baseId) ?? [];
      list.push(offerId);
      offersByBaseId.set(baseId, list);
    }

    const baseIds = Array.from(offersByBaseId.keys());
    const floxBaseIds = shuffle(
      baseIds.filter((id) => !isLocalMerchantCenterId(id))
    );
    const localBaseIds = baseIds.filter((id) => isLocalMerchantCenterId(id));

    console.log(
      "sync-local-inventory start:",
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
    let processedBaseIds = 0;
    let timedOut = false;

    // Look up stock and write it to Merchant Center batch by batch, so every
    // finished batch is saved even if the run is cut short.
    const batches = chunk(floxBaseIds, FLOX_BATCH_SIZE);
    for (let i = 0; i < batches.length; i++) {
      if (Date.now() - startedAt > RUN_BUDGET_MS) {
        timedOut = true;
        break;
      }

      await Promise.all(
        batches[i].map(async (baseId) => {
          let quantity: number;
          try {
            quantity = await getFloxAvailableQuantityWithRetry(baseId);
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
      processedBaseIds += batches[i].length;

      if (i < batches.length - 1) {
        await sleep(FLOX_BATCH_DELAY_MS);
      }
    }

    const summary = {
      checkedAt: new Date().toISOString(),
      durationMs: Date.now() - startedAt,
      timedOut,
      totalOfferIds: offerIds.length,
      floxBaseProducts: floxBaseIds.length,
      processedBaseProducts: processedBaseIds,
      skippedBaseProducts: floxBaseIds.length - processedBaseIds,
      localOnlyBaseProducts: localBaseIds.length,
      succeeded,
      inStock,
      outOfStock,
      floxLookupFailed: floxLookupFailures.length,
      failed: failures.length,
    };

    console.log("sync-local-inventory summary:", JSON.stringify(summary));
    if (floxLookupFailures.length > 0) {
      console.error(
        "sync-local-inventory floxLookupFailures sample:",
        JSON.stringify(floxLookupFailures.slice(0, 5))
      );
    }
    if (failures.length > 0) {
      console.error(
        "sync-local-inventory failures sample:",
        JSON.stringify(failures.slice(0, 5))
      );
    }

    return NextResponse.json({
      ...summary,
      localOnlyBaseIds: localBaseIds,
      floxLookupFailures,
      failures,
    });
  } catch (err) {
    console.error("sync-local-inventory error:", err);
    return NextResponse.json(
      { error: errorMessage(err) },
      { status: 500 }
    );
  }
}
