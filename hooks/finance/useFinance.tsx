import { getFinance } from "@/services/finance";
import { useFinanceSummaryStore } from "@/stores/finance.store";
import { useEffect } from "react";
import { useProducts } from "../product/useProduct";
import { useSale } from "../sale/useSale";

export const useFinance = () => {
  const { products } = useProducts();
  const { sales, getTodaySaleList } = useSale();

  const { finance: data, setFinance } = useFinanceSummaryStore(
    (state) => state
  );

  const changeFinanceStatus = () => {
    if (!sales || !products) return;

    const filteredSales = getTodaySaleList();

    setFinance(getFinance({ products, sales: filteredSales }));
  };

  useEffect(() => {
    changeFinanceStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, sales]);

  return { data, changeFinanceStatus };
};
