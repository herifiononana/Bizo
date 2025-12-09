import { PRODUCTS_KEY } from "@/constants/key-storage";
import { Product } from "@/interface/product/product";
import { getData, saveData } from "@/storage";

export const getProduct = async () => {
  const data = await getData(PRODUCTS_KEY);

  const products: Product[] =
    data?.map((p: any) => {
      let response: Product;
      response = {
        ...p,
        purchasePrice: Number(p?.purchasePrice ?? 0),
        quantity: Number(p?.quantity ?? 0),
        salePrice: p?.salePrice ? Number(p?.salePrice) : undefined,
      };
      return response;
    }) ?? [];

  return products;
};

export const saveProducts = async (data: Product[]) => {
  await saveData(PRODUCTS_KEY, data);
};

export const updateLocalProduct = async (
  data: Product[],
  updatedProduct: Product
) => {
  return data.map((p) => (p.id === updatedProduct.id ? updatedProduct : p));
};
