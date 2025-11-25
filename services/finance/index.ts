import { FinanceSummary } from "@/interface/finance/finance-summary";
import { Product } from "@/interface/product/product";
import { Sale } from "@/interface/sale/sale";

export const getFinance = ({
  products,
  sales,
}: {
  products: Product[];
  sales: Sale[];
}): FinanceSummary => {
  // total de produits
  const totalProducts = products.length;

  // valeur totale du stock = somme (quantité * prix d’achat)
  const totalStockValue = products.reduce(
    (sum, product) => sum + product.quantity * product.purchasePrice,
    0
  );

  // valeur totale des ventes
  const totalSalesValue = sales.reduce(
    (sum, sale) => sum + sale.totalAmount,
    0
  );

  // total des ventes à crédit
  const totalCreditSales = sales
    .filter((sale) => sale.isCredit === true)
    .reduce((sum, sale) => sum + sale.totalAmount, 0);

  // total des ventes payées (hors crédit)
  const totalCashSales = sales
    .filter((sale) => sale.isCredit === false)
    .reduce((sum, sale) => sum + sale.totalAmount, 0);

  // calcul du profit (bénéfice)
  let totalProfit = 0;
  for (const sale of sales) {
    const product = products.find((p) => p.id === sale.productId);
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
    totalCreditSales,
    totalCashSales,
  };
};

// --- Regroupe les ventes par date ---
const groupSalesByDay = (sales: Sale[]) => {
  const groups: Record<string, Sale[]> = {};

  for (const sale of sales) {
    const date = new Date(sale.saleDate);
    const key = date.toISOString().substring(0, 10); // "YYYY-MM-DD"

    if (!groups[key]) groups[key] = [];
    groups[key].push(sale);
  }

  return groups;
};

export const getDailyFinanceList = ({
  products,
  sales,
}: {
  products: Product[];
  sales: Sale[];
}): { date: string; summary: FinanceSummary }[] => {
  const grouped = groupSalesByDay(sales);

  const results: { date: string; summary: FinanceSummary }[] = [];

  for (const date in grouped) {
    const summary = getFinance({
      products,
      sales: grouped[date],
    });

    results.push({
      date,
      summary,
    });
  }

  // trier par date DESC
  results.sort((a, b) => (a.date < b.date ? 1 : -1));

  return results;
};
