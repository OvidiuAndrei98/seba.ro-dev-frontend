export interface CreateProductSet {
  synchronous: boolean;
  productSet: {
    title: string;
    descriptionHtml: string;
    status: "DRAFT";
    productOptions: {
      name: "Conditie";
      position: number;
      values: {
        name: "CA NOU" | "FOLOSIT";
      }[];
    }[];
    variants: {
      optionValues: {
        optionName: string;
        name: string;
      }[];
      price: number;
      taxable?: boolean;
      inventoryPolicy: "DENY";
      inventoryItem: {
        tracked: boolean;
        sku: string;
      };
      inventoryQuantities: {
        locationId: string;
        quantity: number;
        name: "available";
      }[];
    }[];
  };
}

export interface InventorySetQuantitiesInput {
  input: {
    name: "available";
    reason: "correction";
    ignoreCompareQuantity: true;
    quantities: {
      inventoryItemId: string;
      locationId: string;
      quantity: number;
    }[];
  };
}

export interface ProductDeleteInput {
  input: {
    id: string;
  };
}

export interface WebhookSubscriptionTopic {
  topic: string;
  webhookSubscription: {
    callbackUrl: string;
    format: "JSON";
    filter: "type:lookbook";
  };
}
