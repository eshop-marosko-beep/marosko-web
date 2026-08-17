const API_URL = "https://marosko.flox.sk/api/graphql";

const CATEGORY_QUERY = `
query GetCategory($category_id: ID!) {
  getCategory(category_id: $category_id) {
    id
    title
    link
    children {
      id
      title
      link
    }
  }
}
`;

const ROOT_QUERY = `
query ListRootCategories {
  listRootCategories {
    id
    title
    link
  }
}
`;

const TYPE_QUERY = `
query IntrospectType($name: String!) {
  __type(name: $name) {
    name
    fields {
      name
      description
      type {
        name
        kind
        ofType {
          name
          kind
        }
      }
    }
    inputFields {
      name
      description
      type {
        name
        kind
        ofType {
          name
          kind
        }
      }
    }
  }
}
`;

export async function GET(request: Request) {
  const url = new URL(request.url);
  if (url.searchParams.get("key") !== "4ba6785bf2c5d17814727403") {
    return new Response("Not found", { status: 404 });
  }

  const token = process.env.BIZNISWEB_API_TOKEN;
  if (!token) {
    return Response.json({ error: "BIZNISWEB_API_TOKEN not set" }, { status: 500 });
  }

  const categoryId = url.searchParams.get("id");
  const typeName = url.searchParams.get("type");
  const query = typeName ? TYPE_QUERY : categoryId ? CATEGORY_QUERY : ROOT_QUERY;
  const variables = typeName ? { name: typeName } : categoryId ? { category_id: categoryId } : {};

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "BW-API-Key": `Token ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });

  const text = await res.text();
  return Response.json({ status: res.status, body: text.slice(0, 10000) });
}
