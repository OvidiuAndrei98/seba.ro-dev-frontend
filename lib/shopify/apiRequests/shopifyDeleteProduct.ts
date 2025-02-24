import { deleteProductMutation } from "../mutations/deleteProductMutation";
import { shopifyFetch } from "../shopify";
import { ProductDeleteInput } from "../types";

export async function shopifyDeleteProduct(variables: ProductDeleteInput) {
  return await shopifyFetch({
    query: deleteProductMutation(),
    variables: variables,
  });
}
