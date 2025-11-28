// hooks/useCloudSync.ts
import {
  downloadBackup,
  restoreToAsyncStorage,
  uploadBackup,
} from "@/lib/cloudBackup";
import { signInWithGoogleAsync } from "@/lib/googleAuth";
import { useState } from "react";

const ASYNC_KEYS = ["products", "sales", "finance"]; // adapte les clés que tu utilises

export const useCloudSync = () => {
  const [loading, setLoading] = useState(false);
  const [userUid, setUserUid] = useState<string | null>(null);

  async function signIn() {
    setLoading(true);
    const res = await signInWithGoogleAsync();
    setLoading(false);
    if (res.success && res?.user?.uid) {
      setUserUid(res.user.uid);
      return res.user;
    }
    throw new Error("Google sign-in failed");
  }

  async function backup() {
    if (!userUid) throw new Error("Not signed");
    setLoading(true);
    try {
      await uploadBackup(userUid, ASYNC_KEYS);
      setLoading(false);
      return true;
    } catch (e) {
      setLoading(false);
      throw e;
    }
  }

  async function restore() {
    if (!userUid) throw new Error("Not signed");
    setLoading(true);
    try {
      const payload = await downloadBackup(userUid);
      if (!payload) throw new Error("Aucune sauvegarde trouvée");
      await restoreToAsyncStorage(payload);
      setLoading(false);
      return true;
    } catch (e) {
      setLoading(false);
      throw e;
    }
  }

  return { signIn, backup, restore, userUid, loading, setUserUid };
};
