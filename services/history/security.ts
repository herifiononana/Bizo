import { HISTORY_DELETE_PASSWORD_KEY } from "@/constants/key-storage";
import { getData, saveData } from "@/storage";

export const getHistoryDeletePassword = async (): Promise<string | null> => {
  const data = await getData(HISTORY_DELETE_PASSWORD_KEY);
  return typeof data === "string" ? data : null;
};

export const saveHistoryDeletePassword = async (
  password: string
): Promise<void> => {
  await saveData(HISTORY_DELETE_PASSWORD_KEY, password);
};
