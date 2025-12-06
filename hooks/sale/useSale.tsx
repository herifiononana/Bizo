import { getSales, saveSales } from "@/services/sale";
import { useProductsStore } from "@/stores/product.store";
import { useSalesStore } from "@/stores/sales.store";
import { useEffect } from "react";

export type FilteredParamsType = {
  search?: string;
  startDate: Date | null;
  endDate: Date | null;
  creditOnly?: boolean;
  referenceProduct?: string | null;
};

export const useSale = () => {
  const { products } = useProductsStore();
  const { sales, setSales } = useSalesStore();

  const getTodaySaleList = () => {
    if (!sales) return [];

    const date = new Date();
    return sales.filter((sale) => {
      const saleDate = new Date(sale.saleDate);

      const isSameDay =
        saleDate.getFullYear() === date.getFullYear() &&
        saleDate.getMonth() === date.getMonth() &&
        saleDate.getDate() === date.getDate();

      return isSameDay;
    });
  };

  const getTodaySaleListGroupedByReferences = (referenceId: string) => {
    if (!sales) return [];

    const date = new Date();
    return sales.filter((sale) => {
      const saleDate = new Date(sale.saleDate);

      if (!Array.isArray(sales) || !Array.isArray(products)) return [];
      const product = products.find((p) => p.id === sale.productId);
      const matchesReference = referenceId
        ? product?.referenceId === referenceId
        : true;

      const isSameDay =
        saleDate.getFullYear() === date.getFullYear() &&
        saleDate.getMonth() === date.getMonth() &&
        saleDate.getDate() === date.getDate();

      return isSameDay && matchesReference;
    });
  };

  const handleFilterSale = ({
    search = "",
    startDate,
    endDate,
    creditOnly = false,
    referenceProduct,
  }: FilteredParamsType) => {
    if (!Array.isArray(sales) || !Array.isArray(products)) return [];

    return sales.filter((sale) => {
      const product = products.find((p) => p.id === sale.productId);

      // search
      const nameMatch =
        product?.name?.toLowerCase().includes(search.toLowerCase()) ?? false;

      // search by clientName
      const clientNameMatch =
        sale?.clientName?.toLowerCase().includes(search.toLowerCase()) ?? false;

      // filter by reference of product
      const matchesReference = referenceProduct
        ? product?.referenceId === referenceProduct
        : true;

      // filter by date
      const saleDate = new Date(sale.saleDate);
      const saleDay = new Date(
        saleDate.getFullYear(),
        saleDate.getMonth(),
        saleDate.getDate()
      );

      let dateMatch = true;

      if (startDate) {
        const startDay = new Date(
          startDate.getFullYear(),
          startDate.getMonth(),
          startDate.getDate()
        );
        dateMatch = saleDay >= startDay;
      }

      if (endDate) {
        const endDay = new Date(
          endDate.getFullYear(),
          endDate.getMonth(),
          endDate.getDate()
        );
        dateMatch = dateMatch && saleDay <= endDay;
      }

      // 🔥 Filtre ventes à crédit
      const creditMatch = creditOnly ? sale.isCredit === true : true;

      return (
        (nameMatch || clientNameMatch) &&
        dateMatch &&
        creditMatch &&
        matchesReference
      );
    });
  };

  const loadSales = async () => {
    try {
      const storedSales = await getSales();

      if (storedSales) {
        setSales(storedSales);
      } else {
        setSales([]);
        await saveSales([]);
      }
    } catch (e) {
      console.log("Erreur de chargement :", e);
    }
  };

  useEffect(() => {
    loadSales();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    sales,
    handleFilterSale,
    getTodaySaleList,
    loadSales,
    getTodaySaleListGroupedByReferences,
  };
};
