import { getBooking, setBookingStatus, type Booking } from "@/lib/rental/bookings";
import { verifySignature } from "@/lib/rental/crypto";
import { notifyCustomer, toolName } from "@/lib/rental/notify";
import { getRentalTool } from "@/lib/rental/rentalData";

/** Confirm/decline links from the booking email. GET only shows a page with
 * a button and POST makes the change, because mail providers open links in
 * emails on their own (link scanners) and would otherwise decide for you. */

const ACTION_LABEL = { confirm: "Potvrdiť", decline: "Zamietnuť" } as const;
const STATUS_LABEL = { pending: "čaká na potvrdenie", confirmed: "potvrdená", declined: "zamietnutá" } as const;

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function page(body: string, status = 200) {
  return new Response(
    `<!doctype html><html lang="sk"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Požičovňa – rezervácia</title></head>
<body style="font-family:system-ui,sans-serif;max-width:560px;margin:40px auto;padding:0 16px;color:#3b2a1e">${body}</body></html>`,
    { status, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } }
  );
}

type Action = keyof typeof ACTION_LABEL;

async function parse(params: URLSearchParams): Promise<{ booking: Booking; action: Action } | null> {
  const id = params.get("id") ?? "";
  const action = params.get("action");
  const sig = params.get("sig") ?? "";
  if (action !== "confirm" && action !== "decline") return null;
  if (!id || !sig) return null;
  if (!(await verifySignature(`${id}:${action}`, sig))) return null;
  const booking = await getBooking(id);
  return booking ? { booking, action } : null;
}

function summary(booking: Booking) {
  const tool = getRentalTool(booking.toolSlug);
  const name = tool ? toolName(tool.slug, tool.translationKey) : booking.toolSlug;
  return `<p><strong>${escapeHtml(name)}</strong><br>${escapeHtml(booking.from)} – ${escapeHtml(booking.to)} (${booking.days} d.)<br>
${escapeHtml(booking.name)}, ${escapeHtml(booking.email)}, ${escapeHtml(booking.phone)}</p>`;
}

export async function GET(request: Request) {
  const parsed = await parse(new URL(request.url).searchParams);
  if (!parsed) return page("<h1>Neplatný odkaz</h1>", 400);
  const { booking, action } = parsed;

  if (booking.status !== "pending") {
    return page(`<h1>Rezervácia je už ${STATUS_LABEL[booking.status]}</h1>${summary(booking)}`);
  }
  const color = action === "confirm" ? "#16a34a" : "#dc2626";
  return page(`<h1>${ACTION_LABEL[action]} rezerváciu?</h1>${summary(booking)}
<form method="post"><button type="submit" style="background:${color};color:#fff;border:0;padding:12px 22px;border-radius:6px;font-size:16px;cursor:pointer">${ACTION_LABEL[action]}</button></form>`);
}

export async function POST(request: Request) {
  const parsed = await parse(new URL(request.url).searchParams);
  if (!parsed) return page("<h1>Neplatný odkaz</h1>", 400);
  const { booking, action } = parsed;

  if (booking.status !== "pending") {
    return page(`<h1>Rezervácia je už ${STATUS_LABEL[booking.status]}</h1>${summary(booking)}`);
  }
  const updated = await setBookingStatus(booking.id, action === "confirm" ? "confirmed" : "declined");
  if (!updated) return page("<h1>Rezerváciu sa nepodarilo nájsť</h1>", 404);

  const tool = getRentalTool(updated.toolSlug);
  try {
    await notifyCustomer(updated, tool ? toolName(tool.slug, tool.translationKey, updated.locale) : updated.toolSlug);
  } catch (error) {
    console.error("Rental customer email failed", error);
  }

  return page(`<h1>Rezervácia je ${STATUS_LABEL[updated.status]}</h1>${summary(updated)}
<p>Zákazník stav vidí vo svojom účte na marosko.sk.</p>`);
}
