import db from "@/lib/firebase/firesStore";
import { Product } from "@/lib/types";
import {
  collection,
  query,
  where,
  getDocs,
  DocumentData,
} from "firebase/firestore";

const queryProductsByClient = async (
  clientId: string
): Promise<DocumentData[]> => {
  const productsData: DocumentData[] = [];
  const q = query(
    collection(db, "products"),
    where("clientId", "==", clientId)
  );
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    productsData.push(doc.data());
  });
  return productsData;
};

export default queryProductsByClient;
