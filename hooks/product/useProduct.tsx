import { Product } from "@/interface/product/product";
import { getProduct, saveProducts } from "@/services/product";
import { useProductsStore } from "@/stores/product.store";
import { useEffect, useState } from "react";

export const useProducts = () => {
  const products = useProductsStore((state) => state.products);
  const setProducts = useProductsStore((state) => state.setProducts);
  const setIsLoaded = useProductsStore((state) => state.setIsLoaded);

  const [loading, setLoading] = useState(
    () => !useProductsStore.getState().isLoaded
  );

  const loadProducts = async () => {
    if (useProductsStore.getState().isLoaded) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const storedProducts = await getProduct();
      if (storedProducts) {
        setProducts(storedProducts);
      } else {
        setProducts([]);
        await saveProducts([]);
      }
      setIsLoaded(true);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addProduct = async (product: Product) => {
    const next = products ? [...products, product] : [product];
    setProducts(next);
    await saveProducts(next);
  };

  return {
    products,
    addProduct,
    loadProducts,
    loading,
  };
};
