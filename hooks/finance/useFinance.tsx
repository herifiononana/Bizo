import { getFinance } from "@/services/finance";
import { useFinanceSummaryStore } from "@/stores/finance.store";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useProducts } from "../product/useProduct";
import { useSale } from "../sale/useSale";

export const useFinance = () => {
  const { products } = useProducts();
  const { sales, getTodaySaleList, getTodaySaleListGroupedByReferences } =
    useSale();
  const data = useFinanceSummaryStore((state) => state.finance);
  const setFinance = useFinanceSummaryStore((state) => state.setFinance);

  const [loading, setLoading] = useState(true);

  const [selectedReference, setSelectedReference] = useState<
    string | null | undefined
  >();

  const changeFinanceStatus = useCallback(() => {
    if (!sales || !products) return;
    const filteredSales = !selectedReference
      ? getTodaySaleList()
      : getTodaySaleListGroupedByReferences(selectedReference);
    setFinance(
      getFinance({
        products,
        sales: filteredSales,
        reference: selectedReference,
      })
    );
  }, [
    sales,
    products,
    selectedReference,
    getTodaySaleList,
    getTodaySaleListGroupedByReferences,
    setFinance,
  ]);

  const summaryLists = useMemo(() => {
    if (!products || !sales) return null;

    // Build sold count map once: O(sales) instead of O(products × sales)
    const soldCountMap = new Map<string, number>();
    for (const sale of sales) {
      soldCountMap.set(
        sale.productId,
        (soldCountMap.get(sale.productId) ?? 0) + sale.quantity
      );
    }

    const withSoldCount = products.map((p) => ({
      product: p,
      sold: soldCountMap.get(p.id) ?? 0,
    }));

    return {
      topSoldProducts: [...withSoldCount]
        .filter((item) => item.sold > 0)
        .sort((a, b) => b.sold - a.sold)
        .slice(0, 5),

      leastSoldProducts: [...withSoldCount]
        .sort((a, b) => a.sold - b.sold)
        .slice(0, 5),

      mostExpensiveProducts: [...products]
        .sort((a, b) => b.purchasePrice - a.purchasePrice)
        .slice(0, 3),

      leastExpensiveProducts: [...products]
        .sort((a, b) => a.purchasePrice - b.purchasePrice)
        .slice(0, 3),

      newestProducts: [...products]
        .sort(
          (a, b) =>
            new Date(b.createdAt ?? "").getTime() -
            new Date(a.createdAt ?? "").getTime()
        )
        .slice(0, 5),

      oldestProducts: [...products]
        .filter((p) => p.quantity > 0)
        .sort(
          (a, b) =>
            new Date(a.createdAt ?? "").getTime() -
            new Date(b.createdAt ?? "").getTime()
        )
        .slice(0, 5),

      outStockProducts: [...products]
        .filter((p) => p.quantity >= 3)
        .sort(
          (a, b) =>
            new Date(a.createdAt ?? "").getTime() -
            new Date(b.createdAt ?? "").getTime()
        ),
    };
  }, [products, sales]);

  useEffect(() => {
    if (!products || !sales) return;
    changeFinanceStatus();
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, sales, selectedReference]);

  return {
    data,
    loading,
    changeFinanceStatus,
    selectedReference,
    setSelectedReference,
    ...(summaryLists ?? {}),
  };
};
