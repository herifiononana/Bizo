import { mockProducts } from "@/data/mock-product";
import { mockSales } from "@/data/mock-sales";
import { FinanceSummary } from "@/interface/finance/finance-summary";

export const getFinance = (): FinanceSummary => {
  // total de produits en stock
  const totalProducts = mockProducts.length;

  // valeur totale du stock = somme (quantité * prix d’achat)
  const totalStockValue = mockProducts.reduce(
    (sum, product) => sum + product.quantity * product.purchasePrice,
    0
  );

  // valeur totale des ventes = somme (totalPrice)
  const totalSalesValue = mockSales.reduce(
    (sum, sale) => sum + sale.totalAmount,
    0
  );

  // calcul du bénéfice total :
  // profit = total des ventes - coût d’achat des produits vendus
  let totalProfit = 0;
  for (const sale of mockSales) {
    const product = mockProducts.find((p) => p.id === sale.productId);
    if (product) {
      const cost = sale.quantity * product.purchasePrice;
      totalProfit += sale.totalAmount - cost;
    }
  }

  return {
    totalProducts,
    totalStockValue,
    totalSalesValue,
    totalProfit,
  };
};
