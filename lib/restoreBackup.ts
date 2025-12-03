import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

export async function restoreBackup() {
  const user = auth.currentUser;
  if (!user) return false;

  const ref = doc(db, "users", user.uid, "data", "backup");
  const snap = await getDoc(ref);

  if (!snap.exists()) return false;

  const cloudData = snap.data();

  const response = await AsyncStorage.setItem(
    "app-data",
    JSON.stringify(cloudData)
  );
  console.log("response :>> ", response);
  return true;
}
