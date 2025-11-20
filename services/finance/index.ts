// import { FinanceSummary } from "@/interface/finance/finance-summary";
// import { Product } from "@/interface/product/product";
// import { Sale } from "@/interface/sale/sale";

// export const getFinance = ({
//   products,
//   sales,
// }: {
//   products: Product[];
//   sales: Sale[];
// }): FinanceSummary => {
//   // total de produits en stock
//   const totalProducts = products.length;

//   // valeur totale du stock = somme (quantité * prix d’achat)
//   const totalStockValue = products.reduce(
//     (sum, product) => sum + product.quantity * product.purchasePrice,
//     0
//   );

//   // valeur totale des ventes = somme (totalPrice)
//   const totalSalesValue = sales.reduce(
//     (sum, sale) => sum + sale.totalAmount,
//     0
//   );

//   // calcul du bénéfice total :
//   // profit = total des ventes - coût d’achat des produits vendus
//   let totalProfit = 0;
//   for (const sale of sales) {
//     const product = products.find((p) => p.id === sale.productId);
//     if (product) {
//       const cost = sale.quantity * product.purchasePrice;
//       totalProfit += sale.totalAmount - cost;
//     }
//   }

//   return {
//     totalProducts,
//     totalStockValue,
//     totalSalesValue,
//     totalProfit,
//   };
// };
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
