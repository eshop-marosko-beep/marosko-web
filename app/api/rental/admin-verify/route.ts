import { verifySignature } from "@/lib/rental/crypto";
import { activatePendingAdmin, getPendingAdmin, isAdminEmail, normalizeEmail, sessionCookieHeader } from "@/lib/rental/users";

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** Link from the admin confirmation email. Like the booking decision links,
 * GET only shows a button and POST does the change, so mail link scanners
 * can't activate the account on their own. */

function page(body: string, status = 200, headers: Record<string, string> = {}) {
  return new Response(
    `<!doctype html><html lang="sk"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Požičovňa – správca</title></head>
<body style="font-family:system-ui,sans-serif;max-width:560px;margin:40px auto;padding:0 16px;color:#3b2a1e">${body}</body></html>`,
    { status, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", ...headers } }
  );
}

async function verified(request: Request): Promise<{ email: string; nonce: string } | null> {
  const params = new URL(request.url).searchParams;
  const email = normalizeEmail(params.get("email") ?? "");
  const nonce = params.get("n") ?? "";
  const sig = params.get("sig") ?? "";
  if (!email || !nonce || !sig || !isAdminEmail(email)) return null;
  return (await verifySignature(`admin:${email}:${nonce}`, sig)) ? { email, nonce } : null;
}

export async function GET(request: Request) {
  const link = await verified(request);
  if (!link) return page("<h1>Neplatný odkaz</h1>", 400);
  const pending = await getPendingAdmin(link.email);
  if (!pending || pending.nonce !== link.nonce) {
    return page("<h1>Odkaz už bol použitý alebo vypršal</h1><p>Zaregistrujte sa znova, príde vám nový odkaz.</p>", 410);
  }
  return page(`<h1>Potvrdiť správcovský účet?</h1>
<p>${escapeHtml(pending.user.name)}, ${escapeHtml(pending.user.phone)}<br>${escapeHtml(pending.user.email)}</p>
<form method="post"><button type="submit" style="background:#d97706;color:#fff;border:0;padding:12px 22px;border-radius:6px;font-size:16px;cursor:pointer">Potvrdiť</button></form>`);
}

export async function POST(request: Request) {
  const link = await verified(request);
  if (!link) return page("<h1>Neplatný odkaz</h1>", 400);
  const { email } = link;

  const user = await activatePendingAdmin(email, link.nonce);
  if (!user) {
    return page("<h1>Odkaz už bol použitý alebo vypršal</h1><p>Zaregistrujte sa znova, príde vám nový odkaz.</p>", 410);
  }
  const origin = new URL(request.url).origin;
  return page(
    `<h1>Správcovský účet je aktívny</h1><p>Ste prihlásený.</p><p><a href="${origin}/ucet/admin">Otvoriť administráciu</a></p>`,
    200,
    { "Set-Cookie": await sessionCookieHeader(email) }
  );
}
