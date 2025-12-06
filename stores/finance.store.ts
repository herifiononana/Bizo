import { FinanceSummary } from "@/interface/finance/finance-summary";
import { create } from "zustand";

interface FinanceState {
  finance?: FinanceSummary;
  setFinance: (finance: FinanceSummary) => void;
}

export const useFinanceSummaryStore = create<FinanceState>((set) => ({
  finance: {
    totalProducts: 0,
    totalProfit: 0,
    totalSalesValue: 0,
    totalStockValue: 0,
    totalCashSales: 0,
    totalCreditSales: 0,
  },
  setFinance: (finance: FinanceSummary) => {
    set({ finance });
  },
}));
