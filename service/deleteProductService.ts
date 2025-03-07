import db from "@/lib/firebase/firesStore";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

const deleteProductService = async (productId: string): Promise<void> => {
  const q = query(
    collection(db, "products"),
    where("productId", "==", productId)
  );

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach(async (document) => {
    // doc.data() is never undefined for query doc snapshots
    await deleteDoc(doc(db, "products", document.ref.id));
  });
};

export default deleteProductService;
