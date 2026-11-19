import { ARCHIVED_PRODUCTS_KEY } from "@/constants/key-storage";
import { Product } from "@/interface/product/product";
import { getData, saveData } from "@/storage";
import { toProducts } from ".";

export const getArchivedProducts = async (): Promise<Product[]> =>
  toProducts(await getData(ARCHIVED_PRODUCTS_KEY));

export const saveArchivedProducts = async (data: Product[]) => {
  await saveData(ARCHIVED_PRODUCTS_KEY, data);
};
