/** Minimal client for the Upstash Redis REST API (the KV_* variables added
 * by the Upstash integration on Vercel). Plain fetch, so no extra package. */

type Command = (string | number)[];

function config() {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) {
    throw new Error("Chýbajú env premenné KV_REST_API_URL / KV_REST_API_TOKEN");
  }
  return { url, token };
}

/** Preview and production deployments share one database; keep their data
 * apart so test bookings made on a preview never show up on the live site. */
export function key(...parts: string[]): string {
  const env = process.env.VERCEL_ENV === "production" ? "prod" : "preview";
  return ["rental", env, ...parts].join(":");
}

export async function kv<T = unknown>(command: Command): Promise<T> {
  const { url, token } = config();
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  const data = (await res.json()) as { result?: T; error?: string };
  if (!res.ok || data.error) {
    throw new Error(`KV ${command[0]} zlyhal: ${data.error ?? res.status}`);
  }
  return data.result as T;
}

export async function kvPipeline(commands: Command[]): Promise<unknown[]> {
  if (commands.length === 0) return [];
  const { url, token } = config();
  const res = await fetch(`${url}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(commands),
    cache: "no-store",
  });
  const data = (await res.json()) as { result?: unknown; error?: string }[];
  if (!res.ok || !Array.isArray(data)) {
    throw new Error(`KV pipeline zlyhal: ${res.status}`);
  }
  return data.map((entry) => {
    if (entry.error) throw new Error(`KV pipeline zlyhal: ${entry.error}`);
    return entry.result;
  });
}

export async function getJson<T>(k: string): Promise<T | null> {
  const raw = await kv<string | null>(["GET", k]);
  return raw ? (JSON.parse(raw) as T) : null;
}
