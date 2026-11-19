import { OTHER_REFERENCE } from "@/constants/constants";
import { FinanceSummary } from "@/interface/finance/finance-summary";
import { Product } from "@/interface/product/product";
import { Sale } from "@/interface/sale/sale";

export const getFinance = ({
  products,
  archivedProducts = [],
  sales,
  reference,
}: {
  products: Product[];
  // Produits supprimés dont l'historique est conservé : utilisés pour le profit, jamais pour le stock.
  archivedProducts?: Product[];
  sales: Sale[];
  reference?: string | null;
}): FinanceSummary => {
  const currentProduct = reference
    ? reference === OTHER_REFERENCE
      ? products.filter((p) => !p.referenceId)
      : products.filter((p) => p.referenceId === reference)
    : products;
  // total de produits
  const totalProducts = currentProduct.length;

  // valeur totale du stock = somme (quantité * prix d’achat)
  const totalStockValue = currentProduct.reduce(
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

  // calcul du profit (bénéfice) — O(n) avec Map au lieu de O(n × m)
  const productMap = new Map(
    [...products, ...archivedProducts].map((p) => [p.id, p])
  );
  let totalProfit = 0;
  for (const sale of sales) {
    const product = productMap.get(sale.productId);
    if (product) {
      totalProfit += sale.totalAmount - sale.quantity * product.purchasePrice;
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

// --- Filtre les ventes dont le produit appartient à une référence donnée ---
export const filterSalesByReference = (
  sales: Sale[],
  products: Product[],
  reference: string,
  archivedProducts: Product[] = []
): Sale[] => {
  const productMap = new Map(
    [...products, ...archivedProducts].map((p) => [p.id, p])
  );
  return sales.filter((sale) => {
    const product = productMap.get(sale.productId);
    if (!product) return false;
    return reference === OTHER_REFERENCE
      ? !product.referenceId
      : product.referenceId === reference;
  });
};

export const getDailyFinanceList = ({
  products,
  archivedProducts,
  sales,
}: {
  products: Product[];
  archivedProducts?: Product[];
  sales: Sale[];
}): { date: string; summary: FinanceSummary }[] => {
  const grouped = groupSalesByDay(sales);

  const results: { date: string; summary: FinanceSummary }[] = [];

  for (const date in grouped) {
    const summary = getFinance({
      products,
      archivedProducts,
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
