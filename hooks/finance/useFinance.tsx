import { Sale } from "@/interface/sale/sale";
import { getFinance } from "@/services/finance";
import { useFinanceSummaryStore } from "@/stores/finance.store";
import { useEffect, useState } from "react";
import { useProducts } from "../product/useProduct";
import { useSale } from "../sale/useSale";

export const useFinance = () => {
  const { products } = useProducts();
  const { sales } = useSale();
  const [filteredSales, setFilteredSales] = useState<Sale[]>([]);

  const { finance: data, setFinance } = useFinanceSummaryStore(
    (state) => state
  );

  const handleFilterSales = (date: Date) => {
    if (!sales) return;

    setFilteredSales(
      sales.filter((sale) => {
        const saleDate = new Date(sale.saleDate);

        const isSameDay =
          saleDate.getFullYear() === date.getFullYear() &&
          saleDate.getMonth() === date.getMonth() &&
          saleDate.getDate() === date.getDate();

        return isSameDay;
      })
    );
  };

  const changeFinanceStatus = () => {
    if (products && sales) {
      setFinance(getFinance({ products, sales: filteredSales }));
    }
  };

  // --- Quand sales change → filtrer les ventes du jour ---
  useEffect(() => {
    if (sales) {
      handleFilterSales(new Date());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sales]);

  useEffect(() => {
    if (products && filteredSales) {
      setFinance(getFinance({ products, sales: filteredSales }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, sales, filteredSales]);

  return { data, changeFinanceStatus };
};
