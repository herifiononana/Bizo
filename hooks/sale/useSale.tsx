import { SALES_KEY } from "@/constants/key-storage";
import { getSales } from "@/services/sale";
import { saveData } from "@/storage";
import { useSalesStore } from "@/stores/sales.store";
import { useEffect } from "react";
import { useProducts } from "../product/useProduct";

export type FilteredParamsType = {
  search?: string;
  startDate: Date | null;
  endDate: Date | null;
  creditOnly?: boolean;
};

export const useSale = () => {
  const { products } = useProducts();
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

  const handleFilterSale = ({
    search = "",
    startDate,
    endDate,
    creditOnly = false,
  }: FilteredParamsType) => {
    if (!Array.isArray(sales) || !Array.isArray(products)) return [];

    return sales.filter((sale) => {
      const product = products.find((p) => p.id === sale.productId);
      const nameMatch =
        product?.name?.toLowerCase().includes(search.toLowerCase()) ?? false;

      const clientNameMatch =
        sale?.clientName?.toLowerCase().includes(search.toLowerCase()) ?? false;

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

      return (nameMatch || clientNameMatch) && dateMatch && creditMatch;
    });
  };

  const loadSales = async () => {
    try {
      const storedSales = await getSales();

      if (storedSales) {
        setSales(storedSales);
      } else {
        setSales([]);
        await saveData(SALES_KEY, []);
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
  };
};
