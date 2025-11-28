import { z } from "zod";

export const saleSchema = z.object({
  productId: z.string().min(1, "Veuillez choisir un produit"),
  quantity: z
    .string()
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0,
      "Quantité invalide"
    ),
  totalPrice: z.string().optional(),
  salePrice: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Prix invalide"),
  isCredit: z.boolean().optional(),
  clientName: z.string().optional(),
});

export type CreateSaleDTO = z.infer<typeof saleSchema>;
