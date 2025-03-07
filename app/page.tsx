"use client";

import {
  MappedProduct,
  ProductsDataTable,
} from "@/components/ProductsDataTable";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import DrawerForm from "@/components/DrawerForm";
import { firebaseAuth } from "@/lib/firebase/firebaseConfig";
import { Product } from "@/lib/types";
import queryProductsByClient from "@/service/queryProductsByClient";

export default function Home() {
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState<MappedProduct[]>([]);

  const queryProductsData = async () => {
    if (!firebaseAuth.currentUser) {
      return;
    }
    const products = (await queryProductsByClient(
      firebaseAuth.currentUser.uid
    )) as Product[];
    setProducts(
      products.map((p) => {
        return {
          id: p.productId,
          title: p.title,
          price: p.price,
          stock: p.stock,
          inventoryItemId: p.inventoryItemId,
        };
      }) as MappedProduct[]
    );
  };

  useEffect(() => {
    firebaseAuth.onAuthStateChanged(function (user) {
      if (user) {
        queryProductsData();
      } else {
        // No user is signed in.
        // This always redirects back to the login screen.
      }
    });
  }, []);

  const deleteProductFromDb = (id: string) => {
    setProducts((oldValues) => {
      return oldValues.filter((p) => p.id !== id);
    });
  };

  const updateProductFromDb = (
    id: string,
    values: Record<string, string | number | boolean>
  ) => {
    setProducts((oldValues) => {
      return oldValues.map((p) => {
        if (p.inventoryItemId === id) {
          return {
            ...p,
            ...values,
          };
        }
        return p;
      });
    });
  };

  return (
    <>
      <div className="main-container">
        <div className="actions-container">
          <Button onClick={() => setOpen(true)}>Adauga Produs</Button>
        </div>
        <div className="products-container">
          <div className="products">
            <ProductsDataTable
              products={products}
              deleteProduct={(id) => deleteProductFromDb(id)}
              updateProduct={(id, values) => updateProductFromDb(id, values)}
            />
          </div>
        </div>
      </div>
      <Drawer direction="right" dismissible={false} open={open}>
        <DrawerContent className="ml-0 md:ml-[70%] sm:ml-[50%] mt-0 right-0  rounded-l-[10px] inset-y-0">
          <Button
            className="abosulte top-0 p ml-4 w-6 h-8 bg-slate-800"
            onClick={() => setOpen(false)}
          >
            X
          </Button>
          <DrawerHeader className="flex ">
            <DrawerTitle>Adauga produs</DrawerTitle>
          </DrawerHeader>
          <DrawerForm
            setOpen={(open: boolean) => setOpen(open)}
            updateProducts={(product) =>
              setProducts((oldValues) => {
                return [
                  ...oldValues,
                  {
                    id: product.productId,
                    title: product.title,
                    price: product.price,
                    stock: product.stock,
                    inventoryItemId: product.inventoryItemId,
                  },
                ];
              })
            }
          />
        </DrawerContent>
      </Drawer>
      <Toaster />
    </>
  );
}
