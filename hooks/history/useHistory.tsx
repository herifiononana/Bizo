import { getHistory } from "@/services/sale/history";
import { useHistoryStore } from "@/stores/history.store";
import { useSalesStore } from "@/stores/sales.store";
import { useEffect, useState } from "react";

export const useHistory = () => {
  const { sales } = useSalesStore();
  const { history, setHistory } = useHistoryStore();

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Charger ventes
  const loadHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      const storedHistory = await getHistory();

      if (storedHistory) {
        if (sales) {
          setHistory([...sales, ...storedHistory]);
        } else {
          setHistory(storedHistory);
        }
      } else {
        setHistory(sales ?? []);
      }
    } catch (e: any) {
      console.log("Erreur de chargement :", e);
      setError("Erreur de chargement des ventes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sales]);

  return {
    loading,
    history,
    error,
    loadHistory,
  };
};
