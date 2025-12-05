import { REFERENCE_KEY } from "@/constants/key-storage";
import { Reference } from "@/interface/reference";
import { getData, saveData } from "@/storage";

export const getReference = async () => {
  const data = await getData(REFERENCE_KEY);

  const references: Reference[] = data?.map((r: any) => r) ?? [];

  return references;
};

export const saveReference = async (data: Reference[]) => {
  await saveData(REFERENCE_KEY, data);
};
