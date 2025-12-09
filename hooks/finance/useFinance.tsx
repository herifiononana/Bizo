import { getFinance } from "@/services/finance";
import { useFinanceSummaryStore } from "@/stores/finance.store";
import { useEffect, useMemo, useState } from "react";
import { useProducts } from "../product/useProduct";
import { useSale } from "../sale/useSale";

export const useFinance = () => {
  const { products } = useProducts();
  const { sales, getTodaySaleList, getTodaySaleListGroupedByReferences } =
    useSale();
  const { finance: data, setFinance } = useFinanceSummaryStore(
    (state) => state
  );

  const [loading, setLoading] = useState(true);

  const [selectedReference, setSelectedReference] = useState<
    string | null | undefined
  >();

  // ===== Actualisation du dashboard =====
  const changeFinanceStatus = () => {
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
  };

  // ---------- Données dérivées optimisées ----------
  const summaryLists = useMemo(() => {
    if (!products || !sales) return null;

    const withSoldCount = products.map((p) => {
      const qty =
        sales
          ?.filter((s) => s.productId === p.id)
          .reduce((sum, s) => sum + s.quantity, 0) ?? 0;

      return { product: p, sold: qty };
    });

    return {
      topSoldProducts: withSoldCount
        .filter((item) => item.sold > 0)
        .sort((a, b) => b.sold - a.sold)
        .slice(0, 5),

      leastSoldProducts: withSoldCount
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

  // ---------- Détection du moment où tout est OK ----------
  useEffect(() => {
    if (!products || !sales) return;

    changeFinanceStatus();
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, sales, selectedReference]);

  return {
    data,
    loading, // === important ===
    changeFinanceStatus,
    selectedReference,
    setSelectedReference,
    ...(summaryLists ?? {}),
  };
};
