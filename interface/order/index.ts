import { TypeUnit } from "../product/product";

export interface OrderItem {
  productId: string;
  productName: string;

  unit: TypeUnit;
  quantity: number;

  unitPrice: number;
  subTotal: number;

  stockImpact: number; // quantité retirée du stock (en unité de base)
}

export interface Order {
  id: string;
  order: OrderItem[];
  clientId: string;
  clientName: string;
  total: number;
  createdAt?: string;
  updatedAt?: string;
}
