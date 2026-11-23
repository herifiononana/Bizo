export interface Sale {
  id: string;
  productId: string;
  quantity: number;
  salePrice: number;
  totalAmount: number;
  saleDate: string; // ISO date string
  isCredit?: boolean;
  clientName?: string; // client d'une vente à crédit (requis) — pilote les statuts Crédit/Payé
  customerName?: string; // client d'une vente comptant (optionnel) — pour la facture uniquement
  groupId?: string; // shared across all Sale records in a multi-product transaction
  isExpiredLoss?: boolean; // vente automatique à 0 d'un stock expiré (perte)
  updatedAt?: string; // ISO date — set on every edit, absent on original creation
}
