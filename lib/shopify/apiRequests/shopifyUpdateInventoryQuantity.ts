import { updateInventoryQuantity } from "../mutations/updateInventoryQuantity";
import { shopifyFetch } from "../shopify";
import { InventorySetQuantitiesInput } from "../types";

export async function shopifyUpdateInventoryQuantity(
  variables: InventorySetQuantitiesInput
) {
  return await shopifyFetch({
    query: updateInventoryQuantity(),
    variables: variables,
  });
}
