export function deleteProductMutation() {
  return `mutation productDelete($input: ProductDeleteInput!){
    productDelete(input: $input) {
      deletedProductId
      userErrors {
        field
        message
      }
    }
  }`;
}
