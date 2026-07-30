import { Resend } from "resend";

const CONTACT_EMAIL = "eshop.marosko@gmail.com";
const MAX_FIELD_LENGTH = 200;
const MAX_MESSAGE_LENGTH = 5000;

const ERROR_TEXT = {
  invalidRequest: {
    sk: "Neplatná požiadavka.",
    cz: "Neplatný požadavek.",
    en: "Invalid request.",
    ro: "Cerere invalidă.",
  },
  invalidFields: {
    sk: "Vyplňte prosím meno, platný email a správu.",
    cz: "Vyplňte prosím jméno, platný email a zprávu.",
    en: "Please fill in your name, a valid email and a message.",
    ro: "Vă rugăm completați numele, un email valid și mesajul.",
  },
  sendFailed: {
    sk: "Správu sa nepodarilo odoslať. Skúste to prosím neskôr alebo nám napíšte priamo na eshop.marosko@gmail.com.",
    cz: "Zprávu se nepodařilo odeslat. Zkuste to prosím později nebo nám napište přímo na eshop.marosko@gmail.com.",
    en: "The message could not be sent. Please try again later or email us directly at eshop.marosko@gmail.com.",
    ro: "Mesajul nu a putut fi trimis. Încercați din nou mai târziu sau scrieți-ne direct la eshop.marosko@gmail.com.",
  },
} as const;

function resolveLocale(locale: unknown): keyof (typeof ERROR_TEXT)["invalidRequest"] {
  return typeof locale === "string" && locale in ERROR_TEXT.invalidRequest
    ? (locale as keyof (typeof ERROR_TEXT)["invalidRequest"])
    : "sk";
}

function jsonError(error: string, status: number) {
  return Response.json({ success: false, error }, { status });
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError(ERROR_TEXT.invalidRequest.sk, 400);
  }

  const {
    name,
    email,
    phone,
    message,
    subject,
    locale,
  } = (body ?? {}) as {
    name?: unknown;
    email?: unknown;
    phone?: unknown;
    message?: unknown;
    subject?: unknown;
    locale?: unknown;
  };
  const lang = resolveLocale(locale);

  const cleanName = typeof name === "string" ? name.trim() : "";
  const cleanEmail = typeof email === "string" ? email.trim() : "";
  const cleanPhone = typeof phone === "string" ? phone.trim() : "";
  const cleanMessage = typeof message === "string" ? message.trim() : "";
  const cleanSubject = typeof subject === "string" ? subject.trim() : "Kontaktný formulár";

  if (
    !cleanName ||
    cleanName.length > MAX_FIELD_LENGTH ||
    !cleanEmail ||
    !EMAIL_RE.test(cleanEmail) ||
    cleanEmail.length > MAX_FIELD_LENGTH ||
    cleanPhone.length > MAX_FIELD_LENGTH ||
    !cleanMessage ||
    cleanMessage.length > MAX_MESSAGE_LENGTH
  ) {
    return jsonError(ERROR_TEXT.invalidFields[lang], 400);
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not configured");
    return jsonError(ERROR_TEXT.sendFailed[lang], 500);
  }

  const resend = new Resend(apiKey);

  try {
    const { error } = await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL ?? "Kontaktný formulár <onboarding@resend.dev>",
      to: CONTACT_EMAIL,
      replyTo: cleanEmail,
      subject: `${cleanSubject} - ${cleanName}`,
      text: [
        `Meno: ${cleanName}`,
        `Email: ${cleanEmail}`,
        cleanPhone ? `Telefón: ${cleanPhone}` : null,
        "",
        cleanMessage,
      ]
        .filter((line) => line !== null)
        .join("\n"),
    });

    if (error) {
      console.error("Resend error:", error);
      return jsonError(ERROR_TEXT.sendFailed[lang], 502);
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("Contact form send failed:", err);
    return jsonError(ERROR_TEXT.sendFailed[lang], 502);
  }
}
