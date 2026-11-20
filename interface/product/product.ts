export interface Product {
  id: string;
  name: string;
  quantity: number;
  purchasePrice: number;
  salePrice?: number;
  referenceId?: string;
  shelfLifeDays?: number; // durée de vie en jours (optionnelle)
  expiryDate?: number; // timestamp (ms) d'expiration du stock courant
  createdAt?: string; // ISO date string (ex: '2025-11-05T10:00:00Z')
  updatedAt?: string;
}
