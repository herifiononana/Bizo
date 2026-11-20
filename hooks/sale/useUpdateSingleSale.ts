import { useFinance } from "@/hooks/finance/useFinance";
import { Sale } from "@/interface/sale/sale";
import { saveProducts } from "@/services/product";
import { saveSales } from "@/services/sale";
import { useProductsStore } from "@/stores/product.store";
import { useSalesStore } from "@/stores/sales.store";

export const useUpdateSingleSale = () => {
  const products = useProductsStore((state) => state.products);
  const setProducts = useProductsStore((state) => state.setProducts);
  const sales = useSalesStore((state) => state.sales);
  const setSales = useSalesStore((state) => state.setSales);
  const { changeFinanceStatus } = useFinance();

  // Remplace une vente simple par une ou plusieurs lignes ; plusieurs lignes forment un nouveau groupe.
  const updateSingleSale = async (
    originalSale: Sale,
    editedSales: Sale[]
  ): Promise<boolean> => {
    if (!products || !sales) return false;

    const snapshotSales = sales;
    const snapshotProducts = products;

    const groupId = editedSales.length > 1 ? Date.now().toString() : undefined;
    const newSales = editedSales.map((sale) => ({ ...sale, groupId }));

    const updatedProducts = products.map((product) => {
      const newQuantity = newSales
        .filter((sale) => sale.productId === product.id)
        .reduce((sum, sale) => sum + sale.quantity, 0);
      const originalQuantity =
        product.id === originalSale.productId ? originalSale.quantity : 0;
      if (!newQuantity && !originalQuantity) return product;
      return {
        ...product,
        quantity: product.quantity + originalQuantity - newQuantity,
      };
    });
    const updatedSales = sales.flatMap((sale) =>
      sale.id === originalSale.id ? newSales : [sale]
    );

    setSales(updatedSales);
    try {
      await saveSales(updatedSales);
      await saveProducts(updatedProducts);
      setProducts(updatedProducts);
      changeFinanceStatus();
      return true;
    } catch {
      setSales(snapshotSales);
      setProducts(snapshotProducts);
      return false;
    }
  };

  return { updateSingleSale };
};
