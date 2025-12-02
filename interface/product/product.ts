export interface Product {
  id: string;
  name: string;
  quantity: number;
  purchasePrice: number;
  salePrice?: number;
  referenceId?: string;
  createdAt?: string; // ISO date string (ex: '2025-11-05T10:00:00Z')
  updatedAt?: string;
}
