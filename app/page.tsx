"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { shopifyFetch } from "../lib/shopify/shopify";
import { addProduct } from "@/lib/shopify/mutations/addProduct";
import { shopifyAddProductService } from "@/lib/shopify/apiRequests/shopifyAddProductService";
import { shopifyGetInventoryItemsService } from "@/lib/shopify/apiRequests/shopifyGetInventoryItemsService";
import { shopifyUpdateInventoryQuantity } from "@/lib/shopify/apiRequests/shopifyUpdateInventoryQuantity";
import { addProductService } from "@/service/addProductService";
import { firebaseAuth } from "@/lib/firebase/firebaseConfig";
import { shopifyDeleteProduct } from "@/lib/shopify/apiRequests/shopifyDeleteProduct";
import { shopifySubscribeToOrderPlacedService } from "@/lib/shopify/apiRequests/shopifySubscribeToOrderPlacedService";

export default function Home() {
  // NU STERGE, DE MUTAT
  // const [products, setProducts] = useState();

  const addProd = async () => {
    const prod = await shopifyAddProductService({
      synchronous: true,
      productSet: {
        title: "Winter hat",
        descriptionHtml: "FRIGIDER FRUMOS",
        status: "DRAFT",
        productOptions: [
          {
            name: "Conditie",
            position: 1,
            values: [
              {
                name: "CA NOU",
              },
              {
                name: "FOLOSIT",
              },
            ],
          },
        ],
        variants: [
          {
            optionValues: [
              {
                optionName: "Conditie",
                name: "FOLOSIT",
              },
            ],
            price: 79.99,
            inventoryItem: {
              tracked: true,
            },
            // DE schimbat
            inventoryPolicy: "DENY",
          },
          {
            optionValues: [
              {
                optionName: "Conditie",
                name: "CA NOU",
              },
            ],
            price: 69.99,
            taxable: true,
            inventoryPolicy: "DENY",
            inventoryItem: {
              tracked: true,
            },
          },
        ],
      },
    });

    addProductService({
      clientId: "test",
      clientIdRef: "test",
      condition: "CA NOU",
      description: "test23232",
      price: 231,
      productId: prod.body?.data.productSet.product.id,
      stock: 13,
      title: "adaugat test",
    });
  };

  const deleteProd = async () => {
    return await shopifyDeleteProduct({
      input: {
        id: "gid://shopify/Product/14901334966620",
      },
    });
  };

  const updateInv = async () => {
    const invItems = await shopifyGetInventoryItemsService();

    invItems.body?.data.inventoryItems.edges.forEach(async (d: any) => {
      const item = { ...d.node };
      if (item.sku == "test2") {
        const invUpdt = await shopifyUpdateInventoryQuantity({
          input: {
            ignoreCompareQuantity: true,
            name: "available",
            reason: "correction",
            quantities: [
              {
                quantity: 22,
                inventoryItemId: item.id,
                locationId: "gid://shopify/Product/14901334966620",
              },
            ],
          },
        });
        console.log(invUpdt);
      }
    });
  };

  useEffect(() => {
    // console.log(addProd().then((r) => console.log(r)));
    // getInv().then((r) => console.log(r));
    // updateInv();
    // deleteProd();
    shopifySubscribeToOrderPlacedService({
      topic: "PRODUCTS_CREATE",
      webhookSubscription: {
        callbackUrl: "/webhooks",
        filter: "type:lookbook",
        format: "JSON",
      },
    });
  }, []);

  return <></>;
}
