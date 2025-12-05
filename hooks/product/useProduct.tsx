// hooks/useProducts.ts
import { PRODUCTS_KEY } from "@/constants/key-storage";
import { Product } from "@/interface/product/product";
import { getProduct } from "@/services/product";
import { saveData } from "@/storage";
import { useProductsStore } from "@/stores/product.store";
import { useEffect } from "react";

export const useProducts = () => {
  const { products, setProducts } = useProductsStore();

  const loadProducts = async () => {
    const storedProducts = await getProduct();
    if (storedProducts) setProducts(storedProducts);
    else {
      setProducts([]);
      await saveData(PRODUCTS_KEY, []);
    }
  };
  // Charger au montage
  useEffect(() => {
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
    loadProducts,
  };
};
