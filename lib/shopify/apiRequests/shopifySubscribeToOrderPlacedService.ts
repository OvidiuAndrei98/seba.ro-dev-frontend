import { subscribeToOrderPlaced } from "../mutations/subscribeToOrderPlaced";
import { shopifyFetch } from "../shopify";
import { WebhookSubscriptionTopic } from "../types";

export async function shopifySubscribeToOrderPlacedService(
  variables: WebhookSubscriptionTopic
) {
  return await shopifyFetch({
    query: subscribeToOrderPlaced(),
    variables: variables,
  });
}
