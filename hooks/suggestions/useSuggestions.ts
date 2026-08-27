import { Suggestion } from "@/interface/suggestion";
import { getSuggestions } from "@/services/suggestions";
import { useCallback, useState } from "react";
import { useProducts } from "../product/useProduct";
import { useSale } from "../sale/useSale";

export const useSuggestions = () => {
  const { products } = useProducts();
  const { sales } = useSale();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [analyzing, setAnalyzing] = useState(false);

  const analyze = useCallback(() => {
    if (!products || !sales) return;
    setAnalyzing(true);
    // laisse le temps au skeleton de s'afficher avant le calcul (thread JS unique)
    setTimeout(() => {
      setSuggestions(getSuggestions({ products, sales }));
      setAnalyzing(false);
    }, 0);
  }, [products, sales]);

  return { suggestions, analyzing, analyze };
};
