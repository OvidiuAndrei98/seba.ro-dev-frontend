export function addProduct() {
  return `mutation createProductAsynchronous($productSet: ProductSetInput!, $synchronous: Boolean!) {
        productSet(synchronous: $synchronous, input: $productSet) {
          product {
            id
             variants(first: 1) {
  edges {
    node {
      inventoryItem {
        id
      }
    }
  }
}
          }
          productSetOperation {
            id
            status
            userErrors {
              code
              field
              message
            }
          }
          userErrors {
            code
            field
            message
          }
        }
      }`;
}
