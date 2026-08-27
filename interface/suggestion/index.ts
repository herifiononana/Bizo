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
