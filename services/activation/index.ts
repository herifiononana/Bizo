import { ACTIVATION_KEY } from "@/constants/key-storage";
import { Activation } from "@/interface/Activation";
import { getData, saveData } from "@/storage";

export const getActivation = async () => await getData(ACTIVATION_KEY);

export const saveActivation = async (data: Activation) => {
  await saveData(ACTIVATION_KEY, data);
};
