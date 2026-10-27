import { Resend } from "resend";
import type { Booking } from "@/lib/rental/bookings";
import { sign } from "@/lib/rental/crypto";
import { isAdminEmail } from "@/lib/rental/users";
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

  const autoConfirmed = booking.status === "confirmed";
  const confirm = await decisionUrl(origin, booking.id, "confirm");
  const decline = await decisionUrl(origin, booking.id, "decline");
  const rows: [string, string][] = [
    ["Náradie", toolLabel],
    ["Termín", `${booking.from} – ${booking.to} (${booking.days} ${booking.days === 1 ? "deň" : "dní"})`],
    ["Orientačná cena", `${booking.estimatedPrice} €${booking.discountPercent ? ` (zľava ${booking.discountPercent} %)` : ""}`],
    ["Záloha", `${booking.deposit} €`],
    ["Skupina", booking.groupId ?? "–"],
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
    subject: `${autoConfirmed ? "Automaticky potvrdená rezervácia" : "Nová rezervácia"}: ${toolLabel}, ${booking.from} – ${booking.to}`,
    html: `
      <h2>${autoConfirmed ? "Automaticky potvrdená rezervácia" : "Nová rezervácia požičovne"}</h2>
      <table cellpadding="6" style="border-collapse:collapse">
        ${rows.map(([k, v]) => `<tr><td><strong>${escapeHtml(k)}</strong></td><td>${escapeHtml(v)}</td></tr>`).join("")}
      </table>
      ${
        autoConfirmed
          ? `<p>Zákazník je v skupine s automatickým potvrdením, rezervácia je už potvrdená. Zrušiť ju môžete v administrácii.</p>
             <p><a href="${origin}/ucet/admin">Otvoriť administráciu</a></p>`
          : `<p>Termín je v kalendári zablokovaný, kým rezerváciu nepotvrdíte alebo nezamietnete.</p>
             <p>
               <a href="${confirm}" style="background:#16a34a;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none">Potvrdiť</a>
               &nbsp;
               <a href="${decline}" style="background:#dc2626;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none">Zamietnuť</a>
             </p>
             <p><a href="${origin}/ucet/admin">Otvoriť administráciu</a></p>`
      }
    `,
  });
}

/** Tells the shop a new customer registered for the rental. */
export async function notifyNewCustomer(
  user: { email: string; name: string; phone: string; locale: string },
  origin: string
): Promise<void> {
  const client = resend();
  if (!client) throw new Error("Chýba env premenná RESEND_API_KEY");
  const rows: [string, string][] = [
    ["Meno", user.name],
    ["E-mail", user.email],
    ["Telefón", user.phone],
    ["Jazyk webu", user.locale],
  ];
  await client.emails.send({
    from: OWNER_FROM,
    to: OWNER_EMAIL,
    replyTo: user.email,
    subject: `Nový zákazník požičovne: ${user.name}`,
    html: `
      <h2>Nová registrácia v požičovni</h2>
      <table cellpadding="6" style="border-collapse:collapse">
        ${rows.map(([k, v]) => `<tr><td><strong>${escapeHtml(k)}</strong></td><td>${escapeHtml(v)}</td></tr>`).join("")}
      </table>
      <p>Zákazník je v skupine Bežný zákazník. Skupinu mu môžete zmeniť v administrácii.</p>
      <p><a href="${origin}/ucet/admin">Otvoriť administráciu</a></p>
    `,
  });
}

/** Mails a password reset link. Without a sender on a verified domain
 * (RENTAL_FROM_EMAIL) Resend can only reach the shop's own mailbox, so then
 * only the admin gets the link. */
export async function sendPasswordReset(
  user: { email: string; name: string; locale: string },
  link: string
): Promise<void> {
  const client = resend();
  if (!client) throw new Error("Chýba env premenná RESEND_API_KEY");
  const from = CUSTOMER_FROM ?? (user.email === OWNER_EMAIL || isAdminEmail(user.email) ? OWNER_FROM : null);
  if (!from) {
    console.warn("Password reset email skipped: set RENTAL_FROM_EMAIL to mail customers");
    return;
  }
  const t = rentalMessages(user.locale).email;
  await client.emails.send({
    from,
    to: user.email,
    subject: t.resetSubject,
    html: `
      <h2>${escapeHtml(t.resetSubject)}</h2>
      <p>${escapeHtml(t.resetText)}</p>
      <p><a href="${link}" style="background:#d97706;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none">${escapeHtml(t.resetButton)}</a></p>
      <p style="color:#666">${escapeHtml(t.resetIgnore)}</p>
    `,
  });
}

/** Lets the customer know the shop's decision, when a customer-facing
 * sender is configured; otherwise the status is shown in their account. */
export async function notifyCustomer(booking: Booking, toolLabel: string): Promise<void> {
  const client = resend();
  if (!client || !CUSTOMER_FROM || (booking.status !== "confirmed" && booking.status !== "declined")) return;

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

export async function adminVerifyUrl(origin: string, email: string, nonce: string): Promise<string> {
  const sig = await sign(`admin:${email}:${nonce}`);
  return `${origin}/api/rental/admin-verify?email=${encodeURIComponent(email)}&n=${encodeURIComponent(nonce)}&sig=${encodeURIComponent(sig)}`;
}

/** Sends the link that turns a registration with an admin email into an
 * admin account. Goes to the admin mailbox only, which Resend's test sender
 * can reach. */
export async function sendAdminVerification(
  user: { email: string; name: string; phone: string },
  nonce: string,
  origin: string
): Promise<void> {
  const client = resend();
  if (!client) throw new Error("Chýba env premenná RESEND_API_KEY");
  const url = await adminVerifyUrl(origin, user.email, nonce);
  await client.emails.send({
    from: OWNER_FROM,
    to: user.email,
    subject: "Potvrďte správcovský účet požičovne Marosko",
    html: `
      <h2>Správcovský účet požičovne</h2>
      <p>Na marosko.sk sa niekto zaregistroval s adresou správcu požičovne:</p>
      <p><strong>Meno:</strong> ${escapeHtml(user.name)}<br><strong>Telefón:</strong> ${escapeHtml(user.phone)}<br>
      <strong>Čas:</strong> ${escapeHtml(new Date().toISOString().replace("T", " ").slice(0, 16))} UTC</p>
      <p>Ak ste to boli vy, potvrďte to tlačidlom nižšie. Účet dostane heslo zadané pri tejto registrácii a práva správcu.</p>
      <p><a href="${url}" style="background:#d97706;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none">Potvrdiť správcovský účet</a></p>
      <p><strong>Ak ste sa neregistrovali, na tlačidlo neklikajte</strong> – bez potvrdenia sa nič nestane. Odkaz platí 24 hodín.</p>
    `,
  });
}
