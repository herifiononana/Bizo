import { Invoice, InvoiceFormat } from "@/interface/invoice/invoice";
import { Sale } from "@/interface/sale/sale";
import { getSellerInfo } from "@/services/invoice/seller";
import { buildInvoice } from "@/services/invoice/build-invoice";
import { getPageSize, renderInvoiceHtml } from "@/services/invoice/invoice-html";
import { useArchivedProductsStore } from "@/stores/archived-products.store";
import { useProductsStore } from "@/stores/product.store";
import { useSellerStore } from "@/stores/seller.store";
import * as FileSystem from "expo-file-system/legacy";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

export type InvoiceResult = "shared" | "no-seller" | "unavailable" | "error";

// Facture recalculée à chaque appel depuis l'état courant des ventes et produits : rien n'est stocké.
const compute = (sales: Sale[]): Invoice | null => {
  const seller = useSellerStore.getState().seller;
  if (!seller?.businessName || !seller.phone) return null;

  const products = useProductsStore.getState().products ?? [];
  const archived = useArchivedProductsStore.getState().archivedProducts;
  const productMap = new Map([...products, ...archived].map((p) => [p.id, p]));
  return buildInvoice(sales, productMap, seller);
};

export const useInvoice = () => {
  const shareInvoice = async (
    sales: Sale[],
    format: InvoiceFormat
  ): Promise<InvoiceResult> => {
    // Le vendeur peut ne pas être encore chargé si le tableau de bord n'a jamais été ouvert.
    const sellerStore = useSellerStore.getState();
    if (!sellerStore.isLoaded) {
      sellerStore.setSeller(await getSellerInfo());
      sellerStore.setIsLoaded(true);
    }
    const invoice = compute(sales);
    if (!invoice) return "no-seller";

    try {
      if (!(await Sharing.isAvailableAsync())) return "unavailable";

      // On demande le PDF en base64 puis on l'écrit nous-mêmes : le fichier produit par expo-print
      // (cache/Print) est illisible pour expo-file-system et expo-sharing sur certains appareils
      // (« isn't readable » / « Not allowed to read file »).
      const { base64 } = await Print.printToFileAsync({
        html: renderInvoiceHtml(invoice, format),
        base64: true,
        ...getPageSize(invoice, format),
      });
      if (!base64) return "error";

      // Nom de fichier lisible pour le destinataire (ex: FAC-20261123-04821-A4.pdf).
      const suffix = format === "a4" ? "A4" : "80mm";
      const shareUri = `${FileSystem.cacheDirectory}${invoice.number}-${suffix}.pdf`;
      await FileSystem.writeAsStringAsync(shareUri, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      await Sharing.shareAsync(shareUri, {
        mimeType: "application/pdf",
        UTI: "com.adobe.pdf",
        dialogTitle: `Facture ${invoice.number}`,
      });
      return "shared";
    } catch (err) {
      console.error("Erreur shareInvoice :", err);
      return "error";
    }
  };

  return { shareInvoice };
};
