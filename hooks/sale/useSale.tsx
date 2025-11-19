import { SALES_KEY } from "@/constants/key-storage";
import { getData, saveData } from "@/storage";
import { useSalesStore } from "@/stores/sales.store";
import { useEffect } from "react";

export const useSale = () => {
  const { sales, setSales } = useSalesStore();

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedSales = await getData(SALES_KEY);

        if (storedSales) {
          storedSales(storedSales);
          setSales(storedSales);
        } else {
          storedSales([]);
          await saveData(SALES_KEY, []);
        }
      } catch (e) {
        console.log("Erreur de chargement :", e);
      }
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    sales,
  };
};
