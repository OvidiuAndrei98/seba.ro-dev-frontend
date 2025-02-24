import { addProduct } from "../mutations/addProduct";
import { shopifyFetch } from "../shopify";
import { CreateProductSet } from "../types";

export async function shopifyAddProductService(variables: CreateProductSet) {
  return await shopifyFetch({ query: addProduct(), variables: variables });
}
