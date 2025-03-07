"use server";

import "@shopify/shopify-api/adapters/node";
import { shopifyApi, LATEST_API_VERSION } from "@shopify/shopify-api";
import { restResources } from "@shopify/shopify-api/rest/admin/2025-01";

const shopify = shopifyApi({
  apiKey: process.env.NEXT_PUBLIC_SHOPIFY_API_KEY,
  apiSecretKey: process.env.NEXT_PUBLIC_SHOPIFY_API_SECRET,
  adminApiAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_ADMIN_ACCESS_TOKEN,
  apiVersion: LATEST_API_VERSION,
  scopes: ["read_products, write_products"],
  hostName: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN,
  isEmbeddedApp: false,
  isCustomStoreApp: true,
  restResources,
});

const session = shopify.session.customAppSession(
  process.env.NEXT_PUBLIC_SHOPIFY_STORE_NAME
);

export async function shopifyFetch({ query, variables = {} }) {
  try {
    console.log(variables);
    const client = new shopify.clients.Graphql({ session });
    const result = await client.request(query, {
      variables: variables ?? {},
    });

    return {
      status: result.status,
      body: result,
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      status: 500,
      error: "Error receiving data",
    };
  }
}
