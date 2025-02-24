export interface Product {
  clientId: string;
  clientIdRef: string;
  condition: "CA NOU" | "FOLOSIT";
  description: string;
  price: number;
  title: string;
  stock: number;
  productId: string;
}
