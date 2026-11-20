import { useFinance } from "@/hooks/finance/useFinance";
import { applyExpiredLosses } from "@/services/product/expiry";
import { saveProducts } from "@/services/product";
import { saveSales } from "@/services/sale";
import { useProductsStore } from "@/stores/product.store";
import { useSalesStore } from "@/stores/sales.store";
import { useCallback, useEffect, useRef } from "react";
import { AppState } from "react-native";

// Au plus une vérification par heure au retour au premier plan (pas de timer en continu).
const MIN_INTERVAL_MS = 60 * 60 * 1000;

/**
 * Vend à 0 (perte) le stock des produits expirés : à l'ouverture de l'app (une fois les
 * produits et ventes chargés) puis au retour au premier plan. Coût : 0 écriture s'il n'y a
 * rien d'expiré, 2 écritures sinon, quel que soit le nombre de produits.
 */
export const useExpiryCheck = () => {
  const productsLoaded = useProductsStore((s) => s.isLoaded);
  const salesLoaded = useSalesStore((s) => s.isLoaded);
  const { changeFinanceStatus } = useFinance();
  const running = useRef(false);
  const lastCheck = useRef(0);

  const check = useCallback(async () => {
    if (running.current) return;
    const { products, isLoaded: pLoaded, setProducts } = useProductsStore.getState();
    const { sales, isLoaded: sLoaded, setSales } = useSalesStore.getState();
    if (!pLoaded || !sLoaded || !products || !sales) return;

    lastCheck.current = Date.now();
    const result = applyExpiredLosses(products, sales, lastCheck.current);
    if (!result) return;

    running.current = true;
    setProducts(result.products);
    setSales(result.sales);
    try {
      await saveSales(result.sales);
      await saveProducts(result.products);
      changeFinanceStatus();
    } catch {
      setProducts(products);
      setSales(sales);
    } finally {
      running.current = false;
    }
  }, [changeFinanceStatus]);

  useEffect(() => {
    if (productsLoaded && salesLoaded) check();
  }, [productsLoaded, salesLoaded, check]);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active" && Date.now() - lastCheck.current >= MIN_INTERVAL_MS) {
        check();
      }
    });
    return () => sub.remove();
  }, [check]);
};
