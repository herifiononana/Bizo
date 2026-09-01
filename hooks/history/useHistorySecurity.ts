import {
  getHistoryDeletePassword,
  saveHistoryDeletePassword,
} from "@/services/history/security";
import { useHistorySecurityStore } from "@/stores/history-security.store";
import { useEffect } from "react";

export const useHistorySecurity = () => {
  const password = useHistorySecurityStore((state) => state.password);
  const setPassword = useHistorySecurityStore((state) => state.setPassword);
  const isLoaded = useHistorySecurityStore((state) => state.isLoaded);
  const setIsLoaded = useHistorySecurityStore((state) => state.setIsLoaded);

  useEffect(() => {
    if (useHistorySecurityStore.getState().isLoaded) return;
    const loadPassword = async () => {
      const stored = await getHistoryDeletePassword();
      setPassword(stored);
      setIsLoaded(true);
    };
    loadPassword();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hasPassword = password !== null;

  const verifyPassword = (candidate: string): boolean =>
    hasPassword && candidate === password;

  // Un mot de passe déjà défini ne peut être changé qu'en fournissant l'ancien.
  const changePassword = async (
    newPassword: string,
    oldPassword?: string
  ): Promise<boolean> => {
    if (hasPassword && oldPassword !== password) return false;

    setPassword(newPassword);
    await saveHistoryDeletePassword(newPassword);
    return true;
  };

  return { hasPassword, isLoaded, verifyPassword, changePassword };
};
