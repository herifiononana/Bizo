import { useCallback, useState } from "react";

export const useProductSelection = () => {
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const startSelection = useCallback((productId?: string) => {
    setIsSelecting(true);
    if (productId) setSelectedIds(new Set([productId]));
  }, []);

  const toggle = useCallback((productId: string) => {
    setSelectedIds((previous) => {
      const next = new Set(previous);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      return next;
    });
  }, []);

  const selectAll = useCallback((productIds: string[]) => {
    setSelectedIds(new Set(productIds));
  }, []);

  const stopSelection = useCallback(() => {
    setIsSelecting(false);
    setSelectedIds(new Set());
  }, []);

  return {
    isSelecting,
    selectedIds,
    startSelection,
    toggle,
    selectAll,
    stopSelection,
  };
};
