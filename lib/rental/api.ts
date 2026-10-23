/** Shared helpers for the /api/rental/* route handlers. Errors are returned
 * as codes (e.g. "email_taken"); the forms translate them via
 * messages.rental.errors.<code>. */

export function apiError(code: string, status: number, headers?: HeadersInit) {
  return Response.json({ success: false, error: code }, { status, headers });
}

export async function readJson(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const body = await request.json();
    return body && typeof body === "object" ? (body as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

export function str(value: unknown, max = 200): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LOCALES = ["sk", "cz", "en", "ro"];

export function locale(value: unknown): string {
  return typeof value === "string" && LOCALES.includes(value) ? value : "sk";
}
