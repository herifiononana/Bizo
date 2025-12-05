// hooks/useProducts.ts
import { Product } from "@/interface/product/product";
import { getProduct, saveProducts } from "@/services/product";
import { useProductsStore } from "@/stores/product.store";
import { useEffect } from "react";

export const useProducts = () => {
  const { products, setProducts } = useProductsStore();

  const loadProducts = async () => {
    const storedProducts = await getProduct();
    if (storedProducts) setProducts(storedProducts);
    else {
      setProducts([]);
      await saveProducts([]);
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
    await saveProducts(next);
  };

  return {
    products,
    addProduct,
    loadProducts,
  };
};
