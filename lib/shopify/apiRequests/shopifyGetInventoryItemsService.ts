import { getInventoryItems } from "../queries/getInventoryItems";
import { shopifyFetch } from "../shopify";

export async function shopifyGetInventoryItemsService() {
  return await shopifyFetch({
    query: getInventoryItems(),
    variables: {
      inventoryLevel: { locationId: "gid://shopify/Location/102476317020" },
    },
  });
}
