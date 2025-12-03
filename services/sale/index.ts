import { Sale } from "@/interface/sale/sale";
import { auth, db } from "@/lib/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, setDoc } from "firebase/firestore";

export async function saveSale(sale: Sale) {
  // 1️⃣ Sauvegarde locale
  const data = JSON.parse((await AsyncStorage.getItem("sales")) || "[]");
  data.push(sale);
  await AsyncStorage.setItem("sales", JSON.stringify(data));

  // 2️⃣ Sauvegarde Firestore (si connecté)
  const user = auth.currentUser;
  if (user) {
    const ref = doc(db, `users/${user.uid}/sales/${sale.id}`);
    await setDoc(ref, sale, { merge: true });
  }
}
