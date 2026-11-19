import { saveProducts } from "@/services/product";
import { saveSales } from "@/services/sale";
import { useProductsStore } from "@/stores/product.store";
import { useSalesStore } from "@/stores/sales.store";

export const useDeleteProducts = () => {
  const products = useProductsStore((state) => state.products);
  const setProducts = useProductsStore((state) => state.setProducts);
  const sales = useSalesStore((state) => state.sales);
  const setSales = useSalesStore((state) => state.setSales);

  const countLinkedSales = (productIds: Set<string>): number =>
    (sales ?? []).filter((sale) => productIds.has(sale.productId)).length;

  // Même règle que la suppression unitaire : les ventes liées sont supprimées avec le produit.
  const deleteProducts = async (productIds: Set<string>): Promise<boolean> => {
    if (!products) return false;

    const snapshotProducts = products;
    const snapshotSales = sales ?? [];

    const updatedProducts = products.filter(
      (product) => !productIds.has(product.id)
    );
    const updatedSales = snapshotSales.filter(
      (sale) => !productIds.has(sale.productId)
    );

    setProducts(updatedProducts);
    setSales(updatedSales);

    try {
      await saveProducts(updatedProducts);
      await saveSales(updatedSales);
      return true;
    } catch {
      setProducts(snapshotProducts);
      setSales(snapshotSales);
      await saveProducts(snapshotProducts);
      await saveSales(snapshotSales);
      return false;
    }
  };

  return { deleteProducts, countLinkedSales };
};
