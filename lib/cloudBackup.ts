// services/cloudBackup.ts
import { db } from "@/lib/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getDoc, setDoc } from "firebase/firestore";

const BACKUP_COLLECTION = "backups"; // users/{uid}/backups/latest

export async function uploadBackup(userUid: string, keyList: string[]) {
  // keyList: liste des clés AsyncStorage que tu veux sauvegarder, ex: ["products", "sales", "finance"]
  const payload: Record<string, any> = {};
  for (const key of keyList) {
    const raw = await AsyncStorage.getItem(key);
    payload[key] = raw ? JSON.parse(raw) : null;
  }

  // écrire dans Firestore sous users/{uid}/backup/latest
  const ref = doc(db, "users", userUid, BACKUP_COLLECTION, "latest");
  await setDoc(ref, {
    createdAt: new Date().toISOString(),
    payload,
  });
  return true;
}

export async function downloadBackup(userUid: string) {
  const ref = doc(db, "users", userUid, BACKUP_COLLECTION, "latest");
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const docData = snap.data();
  return docData.payload as Record<string, any> | null;
}

export async function restoreToAsyncStorage(payload: Record<string, any>) {
  if (!payload) return false;
  for (const key of Object.keys(payload)) {
    const v = payload[key];
    await AsyncStorage.setItem(key, JSON.stringify(v));
  }
  return true;
}
