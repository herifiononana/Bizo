import { PRODUCTS_KEY } from "@/constants/key-storage";
import { Product } from "@/interface/product/product";
import { getData, saveData } from "@/storage";

// Valeurs numériques potentiellement stockées en chaîne (ex: import CSV).
type StoredProduct = Omit<
  Product,
  "purchasePrice" | "quantity" | "salePrice" | "shelfLifeDays" | "expiryDate"
> & {
  purchasePrice?: unknown;
  quantity?: unknown;
  salePrice?: unknown;
  shelfLifeDays?: unknown;
  expiryDate?: unknown;
};

export const toProducts = (data: StoredProduct[] | null): Product[] =>
  data?.map((p) => ({
    ...p,
    purchasePrice: Number(p?.purchasePrice ?? 0),
    quantity: Number(p?.quantity ?? 0),
    salePrice: p?.salePrice ? Number(p?.salePrice) : undefined,
    shelfLifeDays: p?.shelfLifeDays ? Number(p?.shelfLifeDays) : undefined,
    expiryDate: p?.expiryDate ? Number(p?.expiryDate) : undefined,
  })) ?? [];

export const getProduct = async () => toProducts(await getData(PRODUCTS_KEY));

export const saveProducts = async (data: Product[]) => {
  await saveData(PRODUCTS_KEY, data);
};

export const updateLocalProduct = async (
  data: Product[],
  updatedProduct: Product
) => {
  return data.map((p) => (p.id === updatedProduct.id ? updatedProduct : p));
};
