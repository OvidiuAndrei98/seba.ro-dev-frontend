import db from "@/lib/firebase/firesStore";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";

const updateProductService = async (
  productId: string,
  values: Record<string, string | number | boolean>
): Promise<void> => {
  const q = query(
    collection(db, "products"),
    where("inventoryItemId", "==", productId)
  );

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach(async (document) => {
    // doc.data() is never undefined for query doc snapshots
    await updateDoc(doc(db, "products", document.id), values);
  });
};

export default updateProductService;
