import { buildEshopLlmsTxt } from "@/lib/llmsEshop";

export async function GET() {
  return new Response(buildEshopLlmsTxt("ro"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
