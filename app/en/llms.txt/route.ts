import { buildLlmsTxt } from "@/lib/llmsTxt";

export async function GET() {
  return new Response(buildLlmsTxt("en"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
