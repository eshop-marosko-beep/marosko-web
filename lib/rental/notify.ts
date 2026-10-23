import { Resend } from "resend";
import type { Booking } from "@/lib/rental/bookings";
import { sign } from "@/lib/rental/crypto";
import skMessages from "@/messages/sk.json";
import czMessages from "@/messages/cz.json";
import enMessages from "@/messages/en.json";
import roMessages from "@/messages/ro.json";

const OWNER_EMAIL = process.env.RENTAL_NOTIFY_EMAIL ?? "eshop.marosko@gmail.com";
/** Resend's test sender can only mail the account owner. Customer emails are
 * sent only once a sender on a verified domain is set in RENTAL_FROM_EMAIL. */
const OWNER_FROM = process.env.RENTAL_FROM_EMAIL ?? process.env.CONTACT_FROM_EMAIL ?? "Požičovňa Marosko <onboarding@resend.dev>";
const CUSTOMER_FROM = process.env.RENTAL_FROM_EMAIL;

const messagesByLocale: Record<string, typeof skMessages> = {
  sk: skMessages,
  cz: czMessages,
  en: enMessages,
  ro: roMessages,
};

function rentalMessages(locale: string) {
  return (messagesByLocale[locale] ?? skMessages).rental;
}

export function toolName(slug: string, translationKey: string, locale = "sk"): string {
  const tools = rentalMessages(locale).tools as Record<string, { name: string }>;
  return tools[translationKey]?.name ?? slug;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function decisionUrl(origin: string, id: string, action: "confirm" | "decline"): Promise<string> {
  const sig = await sign(`${id}:${action}`);
  return `${origin}/api/rental/decision?id=${encodeURIComponent(id)}&action=${action}&sig=${encodeURIComponent(sig)}`;
}

function resend(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  return apiKey ? new Resend(apiKey) : null;
}

/** Tells the shop about a new booking request, with confirm/decline links. */
export async function notifyOwner(booking: Booking, toolLabel: string, origin: string): Promise<void> {
  const client = resend();
  if (!client) throw new Error("Chýba env premenná RESEND_API_KEY");

  const confirm = await decisionUrl(origin, booking.id, "confirm");
  const decline = await decisionUrl(origin, booking.id, "decline");
  const rows: [string, string][] = [
    ["Náradie", toolLabel],
    ["Termín", `${booking.from} – ${booking.to} (${booking.days} ${booking.days === 1 ? "deň" : "dní"})`],
    ["Orientačná cena", `${booking.estimatedPrice} €`],
    ["Záloha", `${booking.deposit} €`],
    ["Meno", booking.name],
    ["E-mail", booking.email],
    ["Telefón", booking.phone],
    ["Jazyk webu", booking.locale],
    ["Poznámka", booking.note || "–"],
  ];

  await client.emails.send({
    from: OWNER_FROM,
    to: OWNER_EMAIL,
    replyTo: booking.email,
    subject: `Nová rezervácia: ${toolLabel}, ${booking.from} – ${booking.to}`,
    html: `
      <h2>Nová rezervácia požičovne</h2>
      <table cellpadding="6" style="border-collapse:collapse">
        ${rows.map(([k, v]) => `<tr><td><strong>${escapeHtml(k)}</strong></td><td>${escapeHtml(v)}</td></tr>`).join("")}
      </table>
      <p>Termín je v kalendári zablokovaný, kým rezerváciu nepotvrdíte alebo nezamietnete.</p>
      <p>
        <a href="${confirm}" style="background:#16a34a;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none">Potvrdiť</a>
        &nbsp;
        <a href="${decline}" style="background:#dc2626;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none">Zamietnuť</a>
      </p>
    `,
  });
}

/** Lets the customer know the shop's decision, when a customer-facing
 * sender is configured; otherwise the status is shown in their account. */
export async function notifyCustomer(booking: Booking, toolLabel: string): Promise<void> {
  const client = resend();
  if (!client || !CUSTOMER_FROM || booking.status === "pending") return;

  const t = rentalMessages(booking.locale).email;
  const heading = booking.status === "confirmed" ? t.confirmedHeading : t.declinedHeading;
  const text = booking.status === "confirmed" ? t.confirmedText : t.declinedText;

  await client.emails.send({
    from: CUSTOMER_FROM,
    to: booking.email,
    replyTo: OWNER_EMAIL,
    subject: `${heading}: ${toolLabel}`,
    html: `
      <h2>${escapeHtml(heading)}</h2>
      <p><strong>${escapeHtml(toolLabel)}</strong>, ${escapeHtml(booking.from)} – ${escapeHtml(booking.to)}</p>
      <p>${escapeHtml(text)}</p>
    `,
  });
}
