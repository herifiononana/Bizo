import { Invoice, InvoiceFormat } from "@/interface/invoice/invoice";

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

// Séparateur de milliers par espace insécable, sans dépendre d'Intl.
const formatAr = (value: number) =>
  `${Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} Ar`;

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

const statusLabel = (invoice: Invoice) =>
  invoice.isCredit ? "À PAYER (crédit)" : "PAYÉE";

const sellerLines = (invoice: Invoice) =>
  [
    escapeHtml(invoice.seller.phone),
    invoice.seller.email ? escapeHtml(invoice.seller.email) : "",
  ].filter(Boolean);

const renderA4 = (invoice: Invoice) => `
<html><head><meta charset="utf-8" /><style>
  @page { margin: 18mm; }
  body { font-family: Helvetica, Arial, sans-serif; color: #1a1f36; font-size: 13px; }
  .head { display: flex; justify-content: space-between; border-bottom: 2px solid #1a1f36; padding-bottom: 12px; }
  .seller h1 { margin: 0 0 4px; font-size: 22px; }
  .seller p { margin: 2px 0; color: #4a5070; }
  .meta { text-align: right; }
  .meta h2 { margin: 0 0 4px; font-size: 24px; letter-spacing: 2px; }
  .meta p { margin: 2px 0; }
  .customer { margin: 18px 0 6px; }
  table { width: 100%; border-collapse: collapse; margin-top: 10px; }
  th { text-align: left; background: #eef0f7; padding: 8px; font-size: 12px; }
  td { padding: 8px; border-bottom: 1px solid #e3e6f0; }
  .r { text-align: right; }
  .total { margin-top: 14px; text-align: right; font-size: 18px; font-weight: bold; }
  .status { margin-top: 8px; text-align: right; font-weight: bold; color: ${invoice.isCredit ? "#c2410c" : "#15803d"}; }
  .foot { margin-top: 40px; text-align: center; color: #7a83a2; }
</style></head><body>
  <div class="head">
    <div class="seller">
      <h1>${escapeHtml(invoice.seller.businessName)}</h1>
      ${sellerLines(invoice).map((l) => `<p>${l}</p>`).join("")}
    </div>
    <div class="meta">
      <h2>FACTURE</h2>
      <p>N° ${escapeHtml(invoice.number)}</p>
      <p>Date : ${formatDate(invoice.saleDate)}</p>
    </div>
  </div>
  ${invoice.customerName ? `<p class="customer"><strong>Client :</strong> ${escapeHtml(invoice.customerName)}</p>` : ""}
  <table>
    <tr><th>Produit</th><th class="r">Qté</th><th class="r">Prix unitaire</th><th class="r">Total</th></tr>
    ${invoice.lines
      .map(
        (l) => `<tr><td>${escapeHtml(l.name)}</td><td class="r">${l.quantity}</td><td class="r">${formatAr(l.unitPrice)}</td><td class="r">${formatAr(l.total)}</td></tr>`
      )
      .join("")}
  </table>
  <div class="total">Total : ${formatAr(invoice.total)}</div>
  <div class="status">${statusLabel(invoice)}</div>
  <div class="foot">Merci pour votre confiance.</div>
</body></html>`;

const renderTicket = (invoice: Invoice) => `
<html><head><meta charset="utf-8" /><style>
  @page { margin: 0; }
  body { margin: 0; padding: 6px 8px; width: 64mm; font-family: Helvetica, Arial, sans-serif; font-size: 11px; color: #000; }
  .c { text-align: center; }
  h1 { margin: 0 0 2px; font-size: 14px; }
  p { margin: 1px 0; }
  hr { border: 0; border-top: 1px dashed #000; margin: 6px 0; }
  .line { display: flex; justify-content: space-between; }
  .name { font-weight: bold; }
  .total { font-size: 13px; font-weight: bold; }
</style></head><body>
  <div class="c">
    <h1>${escapeHtml(invoice.seller.businessName)}</h1>
    ${sellerLines(invoice).map((l) => `<p>${l}</p>`).join("")}
  </div>
  <hr />
  <p>FACTURE ${escapeHtml(invoice.number)}</p>
  <p>Date : ${formatDate(invoice.saleDate)}</p>
  ${invoice.customerName ? `<p>Client : ${escapeHtml(invoice.customerName)}</p>` : ""}
  <hr />
  ${invoice.lines
    .map(
      (l) => `<p class="name">${escapeHtml(l.name)}</p><div class="line"><span>${l.quantity} x ${formatAr(l.unitPrice)}</span><span>${formatAr(l.total)}</span></div>`
    )
    .join("")}
  <hr />
  <div class="line total"><span>TOTAL</span><span>${formatAr(invoice.total)}</span></div>
  <p class="c">${statusLabel(invoice)}</p>
  <hr />
  <p class="c">Merci pour votre confiance.</p>
</body></html>`;

// `preview` : rendu pour l'aperçu à l'écran (WebView) — largeur de page fixe réduite à l'écran,
// et marge A4 simulée (les @page du PDF y sont ignorés).
export const renderInvoiceHtml = (
  invoice: Invoice,
  format: InvoiceFormat,
  preview = false
) => {
  const html = format === "a4" ? renderA4(invoice) : renderTicket(invoice);
  if (!preview) return html;

  const { width } = getPageSize(invoice, format);
  const padding = format === "a4" ? "body { padding: 51px; box-sizing: border-box; }" : "";
  return html.replace(
    '<meta charset="utf-8" />',
    `<meta charset="utf-8" /><meta name="viewport" content="width=${width}, user-scalable=no" /><style>html { background: #fff; } ${padding}</style>`
  );
};

// Dimensions de page en points (1 pt = 1/72 in). A4 = 595×842 ; ticket 80 mm = 227 pt de large,
// hauteur estimée selon le nombre de lignes (rouleau : pas de hauteur fixe).
export const getPageSize = (invoice: Invoice, format: InvoiceFormat) =>
  format === "a4"
    ? { width: 595, height: 842 }
    : { width: 227, height: 260 + invoice.lines.length * 44 };
