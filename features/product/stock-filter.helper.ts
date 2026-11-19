import { Product } from "@/interface/product/product";

// "alert" regroupe faible + rupture (bouton de la barre de recherche).
export type StockFilter = "low" | "out" | "alert" | null;

const LOW_STOCK_THRESHOLD = 3;

export const matchesStockFilter = (
  product: Product,
  stockFilter: StockFilter
): boolean => {
  if (stockFilter === "low")
    return product.quantity > 0 && product.quantity <= LOW_STOCK_THRESHOLD;
  if (stockFilter === "out") return product.quantity === 0;
  if (stockFilter === "alert") return product.quantity <= LOW_STOCK_THRESHOLD;
  return true;
};

export const getEmptyListMessage = (stockFilter: StockFilter): string => {
  if (stockFilter === "low") return "Aucun produit en stock faible.";
  if (stockFilter === "out") return "Aucun produit en rupture.";
  if (stockFilter === "alert") return "Aucun produit faible ou en rupture.";
  return "Aucun produit pour le moment.";
};
