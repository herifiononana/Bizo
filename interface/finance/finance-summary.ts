export interface FinanceSummary {
  totalProducts: number; // nombre total d'articles en stock
  totalStockValue: number; // somme (quantité * prix d’achat)
  totalSalesValue: number; // somme totale des ventes
  totalProfit: number; // totalSalesValue - totalStockValue
  totalCreditSales: number; // total des ventes faites à crédit
  totalCashSales: number; // total des ventes payées (hors crédit)
}
