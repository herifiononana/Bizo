import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

export async function backupToCloud() {
  const user = auth.currentUser;
  console.log("user :>> ", user);
  if (!user) return false;

  const raw = await AsyncStorage.getItem("app-data");
  console.log("raw :>> ", raw);
  if (!raw) return false;

  const localData = JSON.parse(raw);

  const ref = doc(db, "users", user.uid, "data", "backup");
  await setDoc(ref, localData, { merge: true });

  return true;
}
