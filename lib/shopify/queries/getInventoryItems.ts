export function getInventoryItems() {
  return `query inventoryItems {
    inventoryItems(first: 100) {
      edges {
        node {
          id
          tracked
          sku
          legacyResourceId
          inventoryLevel(locationId: "gid://shopify/Location/102476317020") {
                item {
                    variant {
                        id
                    }
                }
            }
        }
      }
    }
  }`;
}
