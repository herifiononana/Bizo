export interface SellerInfo {
  businessName: string; // société ou marché
  phone: string;
  email?: string;
}

export type InvoiceFormat = "a4" | "ticket80";

export interface InvoiceLine {
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

// Calculée à la volée à partir des ventes : jamais stockée.
export interface Invoice {
  number: string;
  saleDate: string; // ISO
  customerName?: string;
  lines: InvoiceLine[];
  total: number;
  isCredit: boolean;
  seller: SellerInfo;
}
