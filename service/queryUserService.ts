import db from "@/lib/firebase/firesStore";
import {
  collection,
  query,
  where,
  getDocs,
  DocumentData,
} from "firebase/firestore";

const queryUserService = async (clientId: string): Promise<DocumentData> => {
  let userData: DocumentData = {};
  const q = query(collection(db, "clients"), where("clientId", "==", clientId));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    userData = doc.data();
  });

  return userData;
};

export default queryUserService;
