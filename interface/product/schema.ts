import { z } from "zod";

export const TypeUnitSchema = z.enum(["piece", "carton", "paquet"]);
export type TypeUnit = z.infer<typeof TypeUnitSchema>;

export const ProductUnitSchema = z.object({
  type: TypeUnitSchema,

  conversion: z
    .number()
    .int()
    .positive("La conversion doit être supérieure à 0"),

  salePrice: z
    .number()
    .nonnegative("Le prix de vente ne peut pas être négatif"),
});

export type ProductUnitDTO = z.infer<typeof ProductUnitSchema>;

export const ProductSchema = z
  .object({
    name: z.string().min(2, "Nom du produit trop court"),

    quantity: z
      .string()
      .refine(
        (val) => !isNaN(Number(val)) && Number(val) >= 0,
        "Quantité invalide"
      ),

    purchasePrice: z
      .string()
      .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, "Prix invalide")
      .optional(),

    createdAt: z.string().datetime().optional(),
    updatedAt: z.string().datetime().optional(),

    units: z.array(ProductUnitSchema).min(1, "Au moins une unité est requise"),
  })
  .superRefine((data, ctx) => {
    if (!data.units) return;

    const types = data.units.map((u) => u.type);
    const uniqueTypes = new Set(types);

    if (types.length !== uniqueTypes.size) {
      ctx.addIssue({
        path: ["units"],
        message: "Les types d’unités doivent être uniques",
        code: z.ZodIssueCode.custom,
      });
    }
  });

export type ProductDTO = z.infer<typeof ProductSchema>;
