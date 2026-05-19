import { OTHER_REFERENCE } from "@/constants/constants";
import { getSales, saveSales } from "@/services/sale";
import { useProductsStore } from "@/stores/product.store";
import { useSalesStore } from "@/stores/sales.store";
import { useCallback, useEffect, useMemo, useState } from "react";

export type FilteredParamsType = {
  search?: string;
  startDate: Date | null;
  endDate: Date | null;
  creditOnly?: boolean;
  referenceProduct?: string | null;
};

export const useSale = () => {
  const products = useProductsStore((state) => state.products);
  const sales = useSalesStore((state) => state.sales);
  const setSales = useSalesStore((state) => state.setSales);
  const setIsLoaded = useSalesStore((state) => state.setIsLoaded);

  const [loading, setLoading] = useState(
    () => !useSalesStore.getState().isLoaded
  );
  const [error, setError] = useState<string | null>(null);

  // O(1) product lookup — rebuilt only when products change
  const productMap = useMemo(
    () => new Map((products ?? []).map((p) => [p.id, p])),
    [products]
  );

  const loadSales = async () => {
    if (useSalesStore.getState().isLoaded) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const storedSales = await getSales();
      if (storedSales) {
        setSales(storedSales);
      } else {
        setSales([]);
        await saveSales([]);
      }
      setIsLoaded(true);
    } catch (e: any) {
      console.log("Erreur de chargement :", e);
      setError("Erreur de chargement des ventes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSales();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getTodaySaleList = useCallback(() => {
    if (!sales) return [];
    const date = new Date();
    return sales.filter((sale) => {
      const saleDate = new Date(sale.saleDate);
      return (
        saleDate.getFullYear() === date.getFullYear() &&
        saleDate.getMonth() === date.getMonth() &&
        saleDate.getDate() === date.getDate()
      );
    });
  }, [sales]);

  const getTodaySaleListGroupedByReferences = useCallback(
    (referenceId: string) => {
      if (!sales) return [];
      const date = new Date();
      return sales.filter((sale) => {
        const product = productMap.get(sale.productId);
        let matchesReference = true;
        if (referenceId && product) {
          if (referenceId === OTHER_REFERENCE) {
            matchesReference =
              product.referenceId === null ||
              product.referenceId === undefined ||
              product.referenceId === "";
          } else {
            matchesReference = product.referenceId === referenceId;
          }
        }
        const saleDate = new Date(sale.saleDate);
        const isSameDay =
          saleDate.getFullYear() === date.getFullYear() &&
          saleDate.getMonth() === date.getMonth() &&
          saleDate.getDate() === date.getDate();
        return isSameDay && matchesReference;
      });
    },
    [sales, productMap]
  );

  const handleFilterSale = useCallback(
    ({
      search = "",
      startDate,
      endDate,
      creditOnly = false,
      referenceProduct,
    }: FilteredParamsType) => {
      if (!Array.isArray(sales)) return [];

      return sales.filter((sale) => {
        const product = productMap.get(sale.productId);

        const nameMatch =
          product?.name?.toLowerCase().includes(search.toLowerCase()) ?? false;

        const clientNameMatch =
          sale?.clientName?.toLowerCase().includes(search.toLowerCase()) ??
          false;

        const matchesReference = referenceProduct
          ? product?.referenceId === referenceProduct
          : true;

        const saleDate = new Date(sale.saleDate);
        const saleDay = new Date(
          saleDate.getFullYear(),
          saleDate.getMonth(),
          saleDate.getDate()
        );

        let dateMatch = true;
        if (startDate) {
          const start = new Date(
            startDate.getFullYear(),
            startDate.getMonth(),
            startDate.getDate()
          );
          dateMatch = saleDay >= start;
        }
        if (endDate) {
          const end = new Date(
            endDate.getFullYear(),
            endDate.getMonth(),
            endDate.getDate()
          );
          dateMatch = dateMatch && saleDay <= end;
        }

        const creditMatch = creditOnly ? sale.isCredit === true : true;

        return (
          (nameMatch || clientNameMatch) &&
          dateMatch &&
          creditMatch &&
          matchesReference
        );
      });
    },
    [sales, productMap]
  );

  return {
    sales,
    loading,
    error,
    loadSales,
    handleFilterSale,
    getTodaySaleList,
    getTodaySaleListGroupedByReferences,
  };
};
