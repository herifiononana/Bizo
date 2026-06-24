export interface Sale {
  id: string;
  productId: string;
  quantity: number;
  salePrice: number;
  totalAmount: number;
  saleDate: string; // ISO date string
  isCredit?: boolean;
  clientName?: string;
  groupId?: string; // shared across all Sale records in a multi-product transaction
  updatedAt?: string; // ISO date — set on every edit, absent on original creation
}
