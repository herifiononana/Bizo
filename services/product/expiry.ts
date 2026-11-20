import { Product } from "@/interface/product/product";
import { Sale } from "@/interface/sale/sale";

export const MS_PER_DAY = 86_400_000;

const startOfDay = (time: number) => {
  const d = new Date(time);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * Expiration au jour calendaire : ajouté le 20/11 avec 1 jour de durée → expire dès le
 * 21/11 à 00h00 (heure locale), quelle que soit l'heure d'ajout.
 */
export const computeExpiryDate = (shelfLifeDays: number, from = Date.now()) => {
  const d = startOfDay(from);
  d.setDate(d.getDate() + shelfLifeDays);
  return d.getTime();
};

// Jours calendaires restants avant le jour d'expiration ; 0 ou négatif si expiré.
export const daysUntilExpiry = (expiryDate: number, now = Date.now()) =>
  Math.round((expiryDate - startOfDay(now).getTime()) / MS_PER_DAY);

// Midi du jour d'expiration : évite qu'un décalage de fuseau (UTC) range la perte la veille.
const lossSaleDate = (expiryDate: number) => {
  const d = new Date(expiryDate);
  d.setHours(12, 0, 0, 0);
  return d.toISOString();
};

/**
 * Convertit en perte (vente à 0 Ar) le stock restant de chaque produit expiré. Pure.
 * - Un seul passage O(n), s'arrête sans allocation s'il n'y a rien d'expiré (renvoie null).
 * - Idempotent : le produit traité passe à quantité 0 et perd son `expiryDate`.
 *   Supprimer la vente de perte restaure le stock sans la recréer.
 */
export const applyExpiredLosses = (
  products: Product[],
  sales: Sale[],
  now = Date.now()
): { products: Product[]; sales: Sale[]; count: number } | null => {
  let losses: Sale[] | null = null;
  const nextProducts = products.map((product) => {
    const { expiryDate } = product;
    if (!expiryDate || expiryDate > now) return product;

    const { expiryDate: _expired, ...rest } = product;
    if (product.quantity > 0) {
      (losses ??= []).push({
        id: `exp-${product.id}-${expiryDate}`,
        productId: product.id,
        quantity: product.quantity,
        salePrice: 0,
        totalAmount: 0,
        // Daté du jour d'expiration pour que la perte tombe dans le bon jour de finance.
        saleDate: lossSaleDate(expiryDate),
        isCredit: false,
        isExpiredLoss: true,
      });
    }
    return { ...rest, quantity: 0, updatedAt: new Date(now).toISOString() };
  });

  if (!losses) return null;
  const created: Sale[] = losses;
  return {
    products: nextProducts,
    sales: [...created, ...sales],
    count: created.length,
  };
};
