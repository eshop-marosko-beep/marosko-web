const API_URL = "https://marosko.flox.sk/api/graphql";

const TYPE_QUERY = `
query IntrospectType($name: String!) {
  __type(name: $name) {
    name
    kind
    enumValues { name }
    fields {
      name
      args { name type { name kind ofType { name kind } } }
    }
  }
}
`;

const PRODUCT_LIST_QUERY = `
query GetProductList($lang_code: CountryCodeAlpha2!) {
  getProductList(lang_code: $lang_code) {
    data {
      id
      title
      link
    }
  }
}
`;

async function gql(token: string, query: string, variables: Record<string, unknown>) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "BW-API-Key": `Token ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });
  const text = await res.text();
  return { status: res.status, text };
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  if (url.searchParams.get("key") !== "4ba6785bf2c5d17814727403") {
    return new Response("Not found", { status: 404 });
  }

  const token = process.env.BIZNISWEB_API_TOKEN;
  if (!token) {
    return Response.json({ error: "BIZNISWEB_API_TOKEN not set" }, { status: 500 });
  }

  const mode = url.searchParams.get("mode");

  if (mode === "type") {
    const name = url.searchParams.get("name") ?? "CountryCodeAlpha2";
    const r = await gql(token, TYPE_QUERY, { name });
    return Response.json({ status: r.status, body: r.text.slice(0, 5000) });
  }

  if (mode === "products") {
    const lang = url.searchParams.get("lang") ?? "SK";
    const r = await gql(token, PRODUCT_LIST_QUERY, { lang_code: lang });
    return Response.json({ status: r.status, body: r.text.slice(0, 3000) });
  }

  return Response.json({ error: "specify ?mode=type or ?mode=products&lang=SK" }, { status: 400 });
}
