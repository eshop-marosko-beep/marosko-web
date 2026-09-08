import { NextResponse } from "next/server";
import { JWT } from "google-auth-library";

const MERCHANT_ACCOUNT_ID = "5365276597";
const STORE_CODE = "G1-138";
const CONTENT_LANGUAGE = "sk";
const FEED_LABEL = "SK";
const FLOX_GRAPHQL_URL = "https://eshop.marosko.sk/api/graphql";

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
      };
    }>;
  };
}

function getBaseProductId(offerId: string) {
  const underscoreIndex = offerId.indexOf("_");
  return underscoreIndex === -1 ? offerId : offerId.slice(0, underscoreIndex);
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
    throw new Error(`Flox HTTP ${res.status} ${res.statusText}: ${detail}`);
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

const FLOX_BATCH_SIZE = 15;
const FLOX_BATCH_DELAY_MS = 300;

async function getFloxAvailableQuantities(
  productIds: string[]
): Promise<PromiseSettledResult<{ baseId: string; quantity: number }>[]> {
  const results: PromiseSettledResult<{ baseId: string; quantity: number }>[] =
    [];

  const batches = chunk(productIds, FLOX_BATCH_SIZE);
  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    const batchResults = await Promise.allSettled(
      batch.map(async (baseId) => ({
        baseId,
        quantity: await getFloxAvailableQuantity(baseId),
      }))
    );
    results.push(...batchResults);

    if (i < batches.length - 1) {
      await sleep(FLOX_BATCH_DELAY_MS);
    }
  }

  return results;
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

export async function GET() {
  try {
    const authClient = getAuthClient();

    const query = `
      SELECT
        id,
        offer_id
      FROM product_view
      WHERE feed_label = 'SK'
    `.trim();

    const report = await searchReport(authClient, query);
    const offerIds = (report.results ?? [])
      .map((r) => r.productView?.offerId)
      .filter((id): id is string => Boolean(id));

    const baseIds = Array.from(new Set(offerIds.map(getBaseProductId)));

    const quantityResults = await getFloxAvailableQuantities(baseIds);

    const quantityByBaseId = new Map<string, number>();
    const floxLookupFailures: Array<{ baseId: string; error: string }> = [];

    quantityResults.forEach((result, index) => {
      const baseId = baseIds[index];
      if (result.status === "fulfilled") {
        quantityByBaseId.set(baseId, result.value.quantity);
      } else {
        floxLookupFailures.push({
          baseId,
          error:
            result.reason instanceof Error
              ? result.reason.message
              : String(result.reason),
        });
      }
    });

    const insertResults = await Promise.allSettled(
      offerIds.map(async (offerId) => {
        const baseId = getBaseProductId(offerId);
        const quantity = quantityByBaseId.get(baseId);
        if (quantity === undefined) {
          throw new Error(
            `Nepodarilo sa zistiť množstvo pre základné ID "${baseId}" (Flox)`
          );
        }
        await upsertLocalInventory(authClient, offerId, quantity);
        return { offerId, quantity };
      })
    );

    const succeeded: Array<{ offerId: string; quantity: number }> = [];
    const failed: Array<{ offerId: string; error: string }> = [];

    insertResults.forEach((result, index) => {
      if (result.status === "fulfilled") {
        succeeded.push(result.value);
      } else {
        failed.push({
          offerId: offerIds[index],
          error:
            result.reason instanceof Error
              ? result.reason.message
              : String(result.reason),
        });
      }
    });

    return NextResponse.json({
      checkedAt: new Date().toISOString(),
      totalOfferIds: offerIds.length,
      totalBaseProducts: baseIds.length,
      floxLookupFailures,
      succeeded: succeeded.length,
      failed: failed.length,
      failures: failed,
    });
  } catch (err) {
    console.error("sync-local-inventory error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
