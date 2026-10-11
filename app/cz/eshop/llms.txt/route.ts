import { buildEshopLlmsTxt } from "@/lib/llmsEshop";

export async function GET() {
  return new Response(buildEshopLlmsTxt("cz"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
