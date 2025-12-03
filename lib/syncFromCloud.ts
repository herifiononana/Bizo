import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "./firebase";

export async function syncFromCloud() {
  const user = auth.currentUser;
  if (!user) return;

  const salesSnap = await getDocs(collection(db, `users/${user.uid}/sales`));
  const cloudSales = salesSnap.docs.map((d) => d.data());

  const response = await AsyncStorage.setItem(
    "sales",
    JSON.stringify(cloudSales)
  );
  console.log("response :>> ", response);
}
