export type SuggestionSeverity = "high" | "medium" | "low";

export type SuggestionType =
  | "loss-sale-today"
  | "out-of-stock"
  | "not-profitable"
  | "abnormal-profit"
  | "low-stock-fast"
  | "credit-overdue"
  | "profit-trend-down"
  | "abnormal-quantity"
  | "price-drift"
  | "profit-concentration"
  | "dead-stock"
  | "overvalued-stock"
  | "sales-spike"
  | "monthly-best-worst";

export interface Suggestion {
  id: string;
  type: SuggestionType;
  severity: SuggestionSeverity;
  title: string;
  message: string;
  productId?: string;
}

export const SUGGESTION_TYPE_LABELS: Record<SuggestionType, string> = {
  "loss-sale-today": "Vente à perte",
  "out-of-stock": "Rupture stock",
  "not-profitable": "Pas rentable",
  "abnormal-profit": "Profit anormal",
  "low-stock-fast": "Stock faible",
  "credit-overdue": "Crédit en retard",
  "profit-trend-down": "Profit en baisse",
  "abnormal-quantity": "Quantité anormale",
  "price-drift": "Prix instable",
  "profit-concentration": "Concentration",
  "dead-stock": "Stock mort",
  "overvalued-stock": "Stock immobilisé",
  "sales-spike": "Pic de vente",
  "monthly-best-worst": "Bilan du mois",
};

// Filtres appliqués aux suggestions : intervalle de dates, référence, type
export interface SuggestionFilters {
  startDate: Date | null;
  endDate: Date | null;
  referenceId: string | null; // null = toutes, OTHER_REFERENCE = sans référence
  type: SuggestionType | null; // null = tous les types
}

// Filtre date par défaut = aujourd'hui (fonction pour renvoyer la date du jour à chaque appel)
export const getDefaultSuggestionFilters = (): SuggestionFilters => ({
  startDate: new Date(),
  endDate: new Date(),
  referenceId: null,
  type: null,
});

// Seuils paramétrables par l'utilisateur pour les algorithmes de suggestion
export interface SuggestionSettings {
  lowStockQty: number; // quantité en dessous de laquelle un stock est "faible"
  notProfitableMargin: number; // marge (0-1) en dessous de laquelle un produit est jugé pas rentable
  notProfitableMinUnits: number; // ventes minimum avant de juger la rentabilité d'un produit
  abnormalProfitMultiplier: number; // marge d'une vente = X fois la marge moyenne => vente suspecte
  recentSaleWindowDays: number; // fenêtre (jours) pour juger une vente/rupture "récente"
  lowStockVelocityMinUnits: number; // unités vendues sur la fenêtre pour déclencher l'alerte stock faible
  abnormalQtyWindowDays: number; // fenêtre (jours) pour détecter une quantité de vente anormale
  abnormalQtyMultiplier: number; // quantité d'une vente = X fois la moyenne => quantité suspecte
  minSampleSize: number; // nombre minimum de ventes avant d'appliquer les calculs statistiques
  priceDriftCvThreshold: number; // coefficient de variation du prix (0-1) au-delà duquel le prix est jugé instable
  creditOverdueDays: number; // jours après lesquels un crédit impayé est signalé
  profitTrendWindowDays: number; // fenêtre (jours) de comparaison pour la tendance du profit
  profitTrendDropRatio: number; // ratio (0-1) : profit du jour / moyenne en dessous duquel on alerte
  concentrationShareThreshold: number; // part (0-1) du profit total sur un seul produit jugée risquée
  deadStockDays: number; // jours sans vente au-delà desquels un produit est considéré "jamais vendu" / stock mort
  overvaluedTopN: number; // nombre de produits à remonter pour le stock survalorisé
  overvaluedRotationMultiplier: number; // stock = X fois les ventes => rotation jugée trop lente
  salesSpikeMultiplier: number; // ventes du jour = X fois la moyenne => pic de vente signalé
}

export const DEFAULT_SUGGESTION_SETTINGS: SuggestionSettings = {
  lowStockQty: 3,
  notProfitableMargin: 0.05,
  notProfitableMinUnits: 3,
  abnormalProfitMultiplier: 2,
  recentSaleWindowDays: 30,
  lowStockVelocityMinUnits: 5,
  abnormalQtyWindowDays: 7,
  abnormalQtyMultiplier: 3,
  minSampleSize: 3,
  priceDriftCvThreshold: 0.25,
  creditOverdueDays: 15,
  profitTrendWindowDays: 7,
  profitTrendDropRatio: 0.7,
  concentrationShareThreshold: 0.5,
  deadStockDays: 30,
  overvaluedTopN: 3,
  overvaluedRotationMultiplier: 3,
  salesSpikeMultiplier: 2.5,
};
