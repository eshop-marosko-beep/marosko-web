const CHAT_BACKEND_URL = process.env.CHAT_BACKEND_URL ?? "https://mari-n-chatbot.onrender.com";
const MAX_MESSAGE_LENGTH = 2000;

function jsonError(error: string, status: number) {
  return Response.json({ success: false, error }, { status });
}

/**
 * Server-side proxy to the mari-n-chatbot Flask backend. The backend's CORS
 * config only allows the eshop.marosko.sk origin, so this site's browser JS
 * cannot call it directly — routing the request through our own server
 * sidesteps that without needing changes on the backend.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Neplatná požiadavka.", 400);
  }

  const { message, session_id: sessionId, locale } = (body ?? {}) as {
    message?: unknown;
    session_id?: unknown;
    locale?: unknown;
  };

  if (typeof message !== "string" || !message.trim() || message.length > MAX_MESSAGE_LENGTH) {
    return jsonError("Neplatná správa.", 400);
  }

  try {
    const response = await fetch(`${CHAT_BACKEND_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: message.trim(),
        session_id: typeof sessionId === "string" ? sessionId : undefined,
        locale: typeof locale === "string" ? locale : undefined,
      }),
      // The backend runs on Render's free tier and can cold-start from sleep,
      // so allow well beyond a typical request timeout.
      signal: AbortSignal.timeout(45_000),
    });

    const data = await response.json();
    return Response.json(data, { status: response.status });
  } catch {
    return jsonError("Poradca je momentálne nedostupný. Skúste to prosím neskôr.", 502);
  }
}
