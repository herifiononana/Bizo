import { getFinance } from "@/services/finance";
import { useFinanceSummaryStore } from "@/stores/finance.store";
import { useEffect, useState } from "react";
import { useProducts } from "../product/useProduct";
import { useSale } from "../sale/useSale";

export const useFinance = () => {
  const { products } = useProducts();
  const { sales, getTodaySaleList, getTodaySaleListGroupedByReferences } =
    useSale();
  const { finance: data, setFinance } = useFinanceSummaryStore(
    (state) => state
  );
  const [selectedReference, setSelectedReference] = useState<
    string | null | undefined
  >();

  const changeFinanceStatus = () => {
    if (!sales || !products) return;

    const filteredSales = !selectedReference
      ? getTodaySaleList()
      : getTodaySaleListGroupedByReferences(selectedReference);
    setFinance(getFinance({ products, sales: filteredSales }));
  };

  // --- Calcul des listes pour le dashboard ---
  const topSoldProducts = products
    ? [...products]
        .map((p) => {
          const qty =
            sales
              ?.filter((s) => s.productId === p.id)
              .reduce((sum, s) => sum + s.quantity, 0) ?? 0;

          return { product: p, sold: qty };
        })
        .filter((item) => item.sold > 0)
        .sort((a, b) => b.sold - a.sold)
        .slice(0, 5)
    : [];

  const leastSoldProducts = products
    ? [...products]
        .map((p) => {
          const qty =
            sales
              ?.filter((s) => s.productId === p.id)
              .reduce((sum, s) => sum + s.quantity, 0) ?? 0;

          return { product: p, sold: qty };
        })
        .sort((a, b) => a.sold - b.sold)
        .slice(0, 5)
    : [];

  const mostExpensiveProducts = products
    ? [...products]
        .sort((a, b) => b.purchasePrice - a.purchasePrice)
        .slice(0, 3)
    : [];

  const leastExpensiveProducts = products
    ? [...products]
        .sort((a, b) => a.purchasePrice - b.purchasePrice)
        .slice(0, 3)
    : [];

  const newestProducts = products
    ? [...products]
        .sort(
          (a, b) =>
            new Date(b?.createdAt ?? "").getTime() -
            new Date(a?.createdAt ?? "").getTime()
        )
        .slice(0, 5)
    : [];

  const oldestProducts = products
    ? [...products]
        .filter((p) => p.quantity > 0) // stock disponible
        .sort(
          (a, b) =>
            new Date(a?.createdAt ?? "").getTime() -
            new Date(b?.createdAt ?? "").getTime()
        )
        .slice(0, 5)
    : [];

  const outStockProducts = products
    ? [...products]
        .filter((p) => p.quantity >= 3) // Produit en rupture de stock
        .sort(
          (a, b) =>
            new Date(a?.createdAt ?? "").getTime() -
            new Date(b?.createdAt ?? "").getTime()
        )
    : [];

  useEffect(() => {
    if (!products || !sales) return;

    // const filteredSales = getTodaySaleList();
    // const newFinance = getFinance({ products, sales: filteredSales });

    // setFinance(newFinance);
    changeFinanceStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, sales, selectedReference]);

  return {
    data,
    changeFinanceStatus,
    topSoldProducts,
    leastSoldProducts,
    mostExpensiveProducts,
    leastExpensiveProducts,
    newestProducts,
    oldestProducts,
    outStockProducts,
    selectedReference,
    setSelectedReference,
  };
};
