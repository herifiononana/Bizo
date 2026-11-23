import { SELLER_INFO_KEY } from "@/constants/key-storage";
import { SellerInfo } from "@/interface/invoice/invoice";
import { getData, saveData } from "@/storage";

export const getSellerInfo = async (): Promise<SellerInfo | null> =>
  (await getData(SELLER_INFO_KEY)) ?? null;

export const saveSellerInfo = async (info: SellerInfo) => {
  await saveData(SELLER_INFO_KEY, info);
};
