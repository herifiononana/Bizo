import { getArchivedProducts } from "@/services/product/archive";
import { useArchivedProductsStore } from "@/stores/archived-products.store";
import { useEffect } from "react";

// Charge les produits archivés ; `force` recharge même si déjà chargés (ex: après import CSV).
export const loadArchivedProducts = async (force = false) => {
  const { isLoaded, setArchivedProducts, setIsLoaded } =
    useArchivedProductsStore.getState();
  if (isLoaded && !force) return;
  setArchivedProducts(await getArchivedProducts());
  setIsLoaded(true);
};

export const useArchivedProducts = () => {
  const archivedProducts = useArchivedProductsStore(
    (state) => state.archivedProducts
  );

  useEffect(() => {
    loadArchivedProducts();
  }, []);

  return { archivedProducts };
};
