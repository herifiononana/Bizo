import { useFinance } from "@/hooks/finance/useFinance";
import { Sale } from "@/interface/sale/sale";
import { saveProducts } from "@/services/product";
import { removeSalesByIds, saveSales } from "@/services/sale";
import { saveHistory } from "@/services/sale/history";
import { useHistoryStore } from "@/stores/history.store";
import { useProductsStore } from "@/stores/product.store";
import { useSalesStore } from "@/stores/sales.store";

const buildRestoredQuantityByProductId = (daySales: Sale[]) => {
  const restoredQuantityByProductId = new Map<string, number>();
  for (const sale of daySales) {
    restoredQuantityByProductId.set(
      sale.productId,
      (restoredQuantityByProductId.get(sale.productId) ?? 0) + sale.quantity
    );
  }
  return restoredQuantityByProductId;
};

export const useDeleteDaySales = () => {
  const sales = useSalesStore((state) => state.sales);
  const setSales = useSalesStore((state) => state.setSales);
  const storedHistory = useHistoryStore((state) => state.storedHistory);
  const setStoredHistory = useHistoryStore((state) => state.setStoredHistory);
  const products = useProductsStore((state) => state.products);
  const setProducts = useProductsStore((state) => state.setProducts);
  const { changeFinanceStatus } = useFinance();

  // Supprime les ventes d'une journée et restaure le stock des produits concernés.
  const deleteDaySales = async (daySales: Sale[]): Promise<boolean> => {
    if (!products || !sales) return false;

    const snapshotSales = sales;
    const snapshotHistory = storedHistory;
    const snapshotProducts = products;

    const idsToRemove = new Set(daySales.map((sale) => sale.id));
    const restoredQuantityByProductId = buildRestoredQuantityByProductId(daySales);

    const updatedProducts = products.map((product) => {
      const restoredQuantity = restoredQuantityByProductId.get(product.id);
      return restoredQuantity
        ? { ...product, quantity: product.quantity + restoredQuantity }
        : product;
    });
    const updatedSales = removeSalesByIds(sales, idsToRemove);
    const updatedHistory = removeSalesByIds(storedHistory ?? [], idsToRemove);

    setSales(updatedSales);
    setStoredHistory(updatedHistory);
    setProducts(updatedProducts);

    try {
      await saveSales(updatedSales);
      await saveHistory(updatedHistory);
      await saveProducts(updatedProducts);
      changeFinanceStatus();
      return true;
    } catch {
      setSales(snapshotSales);
      setStoredHistory(snapshotHistory);
      setProducts(snapshotProducts);
      return false;
    }
  };

  return { deleteDaySales };
};
