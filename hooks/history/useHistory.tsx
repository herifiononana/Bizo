import { getHistory } from "@/services/sale/history";
import { useHistoryStore } from "@/stores/history.store";
import { useSalesStore } from "@/stores/sales.store";
import { useEffect, useMemo, useState } from "react";

export const useHistory = () => {
  const sales = useSalesStore((state) => state.sales);
  const storedHistory = useHistoryStore((state) => state.storedHistory);
  const setStoredHistory = useHistoryStore((state) => state.setStoredHistory);
  const setIsLoaded = useHistoryStore((state) => state.setIsLoaded);

  const [loading, setLoading] = useState(
    () => !useHistoryStore.getState().isLoaded
  );
  const [error, setError] = useState<string | null>(null);

  // Combine current sales + historical sales reactively — no AsyncStorage re-read on sales change
  const history = useMemo(
    () => [...(sales ?? []), ...(storedHistory ?? [])],
    [sales, storedHistory]
  );

  const loadHistory = async () => {
    if (useHistoryStore.getState().isLoaded) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const data = await getHistory();
      setStoredHistory(data ?? []);
      setIsLoaded(true);
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
  }, []);

  return {
    loading,
    history,
    error,
    loadHistory,
  };
};
