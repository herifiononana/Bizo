export interface Sale {
  id: string;
  productId: string;
  quantity: number;
  salePrice: number;
  totalAmount: number;
  saleDate: string; // ISO date string
  isCredit?: boolean;
}
