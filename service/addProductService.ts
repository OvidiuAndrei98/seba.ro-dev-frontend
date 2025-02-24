import db from "@/lib/firebase/firesStore";
import { Product } from "@/lib/types";
import { collection, addDoc, DocumentReference } from "firebase/firestore";

export async function addProductService(
  product: Product
): Promise<DocumentReference> {
  const docRef = await addDoc(collection(db, "products"), product);
  return docRef;
}
