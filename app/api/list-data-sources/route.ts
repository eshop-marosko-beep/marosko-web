import { NextResponse } from "next/server";
import { JWT } from "google-auth-library";

const MERCHANT_ACCOUNT_ID = "5365276597";

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

export async function GET() {
  try {
    const authClient = getAuthClient();
    const url = `https://merchantapi.googleapis.com/datasources/v1/accounts/${MERCHANT_ACCOUNT_ID}/dataSources`;

    const res = await authClient.request({
      url,
      method: "GET",
    });

    return NextResponse.json({ success: true, result: res.data });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Unknown error",
        details: err?.response?.data ?? null,
      },
      { status: 500 }
    );
  }
}
