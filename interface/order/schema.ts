import { z } from "zod";

export const OrderItemSchema = z.object({
  productId: z.string().min(1),
  productName: z.string().min(1),

  unit: z.enum(["piece", "carton", "paquet"]),
  quantity: z
    .string()
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) >= 0,
      "Quantité invalide"
    ),

  unitPrice: z
    .string()
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) >= 0,
      "Prix unitaire invalide"
    ),
  subTotal: z
    .string()
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) >= 0,
      "Sous total invalide"
    ),

  stockImpact: z
    .string()
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) >= 0,
      "Impact dans le stock invalide"
    ),
});

export const OrderSchema = z.object({
  clientId: z.string().min(1, "Client requis"),
  clientName: z.string().min(1, "Client requis"),
  order: z.array(OrderItemSchema).min(1, "Ajouter au moins un produit"),
  total: z
    .string()
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) >= 0,
      "Quantité invalide"
    ),
});

export type OrderDTO = z.infer<typeof OrderSchema>;
