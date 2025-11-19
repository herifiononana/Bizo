// hooks/useProducts.ts
import { PRODUCTS_KEY } from "@/constants/key-storage";
import { Product } from "@/interface/product/product";
import { getData, saveData } from "@/storage";
import { useProductsStore } from "@/stores/product.store";
import { useEffect } from "react";

export const useProducts = () => {
  const { products, setProducts } = useProductsStore();

  // Charger au montage
  useEffect(() => {
    const loadProducts = async () => {
      const storedProducts = await getData(PRODUCTS_KEY);
      if (storedProducts) setProducts(storedProducts);
      else {
        setProducts([]);
        await saveData(PRODUCTS_KEY, []);
      }
    };
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Ajouter un produit
  const addProduct = async (product: Product) => {
    const next = products ? [...products, product] : [product];
    setProducts(next);
    await saveData(PRODUCTS_KEY, next);
  };

  return {
    products,
    addProduct,
  };
};
