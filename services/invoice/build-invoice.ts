import { Invoice, SellerInfo } from "@/interface/invoice/invoice";
import { Product } from "@/interface/product/product";
import { Sale } from "@/interface/sale/sale";

// Numéro déterministe (pas de compteur à stocker) : date de vente + fin de l'identifiant de transaction.
// Les ids de vente sont `${timestamp}_${i}` et le groupId `${timestamp}` : une même transaction → un même numéro.
const buildNumber = (first: Sale) => {
  const day = first.saleDate.slice(0, 10).replace(/-/g, "");
  const key = (first.groupId ?? first.id).split("_")[0].replace(/\D/g, "");
  return `FAC-${day}-${key.slice(-5).padStart(5, "0")}`;
};

/** Construit la facture d'une transaction (une vente ou un groupe). Pure : recalculée à chaque appel. */
export const buildInvoice = (
  sales: Sale[],
  productMap: Map<string, Product>,
  seller: SellerInfo
): Invoice => {
  const first = sales[0];
  const lines = sales.map((sale) => ({
    name: productMap.get(sale.productId)?.name ?? "Produit supprimé",
    quantity: sale.quantity,
    unitPrice: sale.salePrice,
    total: sale.totalAmount,
  }));

  return {
    number: buildNumber(first),
    saleDate: first.saleDate,
    customerName: first.clientName || first.customerName || undefined,
    lines,
    total: lines.reduce((sum, line) => sum + line.total, 0),
    isCredit: sales.some((sale) => sale.isCredit),
    seller,
  };
};
