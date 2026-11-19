import { saveProducts } from "@/services/product";
import { saveArchivedProducts } from "@/services/product/archive";
import { saveSales } from "@/services/sale";
import { useArchivedProductsStore } from "@/stores/archived-products.store";
import { useProductsStore } from "@/stores/product.store";
import { useSalesStore } from "@/stores/sales.store";
import { loadArchivedProducts } from "./useArchivedProducts";

export const useDeleteProducts = () => {
  const products = useProductsStore((state) => state.products);
  const setProducts = useProductsStore((state) => state.setProducts);
  const sales = useSalesStore((state) => state.sales);
  const setSales = useSalesStore((state) => state.setSales);

  const countLinkedSales = (productIds: Set<string>): number =>
    (sales ?? []).filter((sale) => productIds.has(sale.productId)).length;

  // keepHistory : le produit est archivé (ventes et finances conservées).
  // Sinon les ventes liées sont supprimées avec le produit.
  const deleteProducts = async (
    productIds: Set<string>,
    keepHistory = true
  ): Promise<boolean> => {
    if (!products) return false;

    // Évite d'écraser le stockage avec une liste d'archives pas encore chargée.
    await loadArchivedProducts();
    const { archivedProducts, setArchivedProducts } =
      useArchivedProductsStore.getState();

    const snapshotProducts = products;
    const snapshotSales = sales ?? [];
    const snapshotArchived = archivedProducts;

    const removedProducts = products.filter((product) =>
      productIds.has(product.id)
    );
    const updatedProducts = products.filter(
      (product) => !productIds.has(product.id)
    );
    const updatedSales = keepHistory
      ? snapshotSales
      : snapshotSales.filter((sale) => !productIds.has(sale.productId));
    const updatedArchived = keepHistory
      ? [...snapshotArchived, ...removedProducts]
      : snapshotArchived;

    setProducts(updatedProducts);
    setSales(updatedSales);
    setArchivedProducts(updatedArchived);

    try {
      await saveProducts(updatedProducts);
      await saveSales(updatedSales);
      await saveArchivedProducts(updatedArchived);
      return true;
    } catch {
      setProducts(snapshotProducts);
      setSales(snapshotSales);
      setArchivedProducts(snapshotArchived);
      await saveProducts(snapshotProducts);
      await saveSales(snapshotSales);
      await saveArchivedProducts(snapshotArchived);
      return false;
    }
  };

  return { deleteProducts, countLinkedSales };
};
