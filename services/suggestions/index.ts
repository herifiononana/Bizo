import { OTHER_REFERENCE } from "@/constants/constants";
import { Product } from "@/interface/product/product";
import { Sale } from "@/interface/sale/sale";
import {
  DEFAULT_SUGGESTION_SETTINGS,
  Suggestion,
  SuggestionFilters,
  SuggestionSettings,
  SuggestionType,
} from "@/interface/suggestion";

// Ordre de priorité d'affichage (du plus urgent au plus informatif)
const PRIORITY_ORDER: SuggestionType[] = [
  "loss-sale-today",
  "out-of-stock",
  "not-profitable",
  "abnormal-profit",
  "low-stock-fast",
  "credit-overdue",
  "profit-trend-down",
  "abnormal-quantity",
  "price-drift",
  "profit-concentration",
  "dead-stock",
  "overvalued-stock",
  "sales-spike",
  "monthly-best-worst",
];

const money = (n: number) => `${Math.round(n).toLocaleString("fr-FR")} Ar`;

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const daysBetween = (a: Date, b: Date) =>
  Math.floor((a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24));

const mean = (values: number[]) =>
  values.length ? values.reduce((s, v) => s + v, 0) / values.length : 0;

const stdDev = (values: number[]) => {
  if (values.length < 2) return 0;
  const m = mean(values);
  return Math.sqrt(mean(values.map((v) => (v - m) ** 2)));
};

// Applique le filtre référence + intervalle de dates avant tout calcul
const applyFilters = (
  products: Product[],
  sales: Sale[],
  filters?: SuggestionFilters
) => {
  if (!filters) return { products, sales };

  const filteredProducts = filters.referenceId
    ? products.filter((p) =>
        filters.referenceId === OTHER_REFERENCE
          ? !p.referenceId
          : p.referenceId === filters.referenceId
      )
    : products;

  const productIds = new Set(filteredProducts.map((p) => p.id));
  let filteredSales = filters.referenceId
    ? sales.filter((s) => productIds.has(s.productId))
    : sales;

  if (filters.startDate) {
    const start = new Date(filters.startDate);
    start.setHours(0, 0, 0, 0);
    filteredSales = filteredSales.filter((s) => new Date(s.saleDate) >= start);
  }
  if (filters.endDate) {
    const end = new Date(filters.endDate);
    end.setHours(23, 59, 59, 999);
    filteredSales = filteredSales.filter((s) => new Date(s.saleDate) <= end);
  }

  return { products: filteredProducts, sales: filteredSales };
};

type ProductStats = {
  product: Product;
  sales: Sale[];
  unitsSold: number;
  revenue: number;
  cost: number;
  profit: number;
  marginRatio: number; // profit / revenue
  avgSalePrice: number;
  avgQuantityPerSale: number;
  lastSaleDate: Date | null;
};

const buildProductStats = (products: Product[], sales: Sale[]): ProductStats[] => {
  const salesByProduct = new Map<string, Sale[]>();
  for (const sale of sales) {
    const list = salesByProduct.get(sale.productId) ?? [];
    list.push(sale);
    salesByProduct.set(sale.productId, list);
  }

  return products.map((product) => {
    const productSales = salesByProduct.get(product.id) ?? [];
    const unitsSold = productSales.reduce((sum, s) => sum + s.quantity, 0);
    const revenue = productSales.reduce((sum, s) => sum + s.totalAmount, 0);
    const cost = productSales.reduce(
      (sum, s) => sum + s.quantity * product.purchasePrice,
      0
    );
    const profit = revenue - cost;
    const marginRatio = revenue > 0 ? profit / revenue : 0;
    const avgSalePrice =
      unitsSold > 0
        ? productSales.reduce((sum, s) => sum + s.salePrice * s.quantity, 0) /
          unitsSold
        : 0;
    const avgQuantityPerSale =
      productSales.length > 0 ? unitsSold / productSales.length : 0;
    const lastSaleDate = productSales.length
      ? new Date(
          Math.max(...productSales.map((s) => new Date(s.saleDate).getTime()))
        )
      : null;

    return {
      product,
      sales: productSales,
      unitsSold,
      revenue,
      cost,
      profit,
      marginRatio,
      avgSalePrice,
      avgQuantityPerSale,
      lastSaleDate,
    };
  });
};

// 1. Vente à perte aujourd'hui
const detectLossSalesToday = (stats: ProductStats[], now: Date): Suggestion[] => {
  const suggestions: Suggestion[] = [];
  for (const s of stats) {
    const lossToday = s.sales.filter(
      (sale) =>
        isSameDay(new Date(sale.saleDate), now) &&
        sale.salePrice < s.product.purchasePrice
    );
    if (!lossToday.length) continue;
    const totalLoss = lossToday.reduce(
      (sum, sale) =>
        sum + (s.product.purchasePrice - sale.salePrice) * sale.quantity,
      0
    );
    suggestions.push({
      id: `loss-sale-today-${s.product.id}`,
      type: "loss-sale-today",
      severity: "high",
      title: `Vente à perte sur ${s.product.name}`,
      message: `Aujourd'hui, ${s.product.name} a été vendu en dessous de son prix d'achat. Perte estimée : ${money(totalLoss)}.`,
      productId: s.product.id,
    });
  }
  return suggestions;
};

// 2. Rupture de stock sur un produit qui se vend
const detectOutOfStock = (
  stats: ProductStats[],
  now: Date,
  settings: SuggestionSettings
): Suggestion[] =>
  stats
    .filter(
      (s) =>
        s.product.quantity === 0 &&
        s.lastSaleDate &&
        daysBetween(now, s.lastSaleDate) <= settings.recentSaleWindowDays
    )
    .map((s) => ({
      id: `out-of-stock-${s.product.id}`,
      type: "out-of-stock" as const,
      severity: "high" as const,
      title: `Rupture de stock : ${s.product.name}`,
      message: `${s.product.name} est en rupture et se vendait encore récemment. Il faut le recommander.`,
      productId: s.product.id,
    }));

// 3. Produit pas rentable
const detectNotProfitable = (
  stats: ProductStats[],
  settings: SuggestionSettings
): Suggestion[] =>
  stats
    .filter(
      (s) =>
        s.unitsSold >= settings.notProfitableMinUnits &&
        s.marginRatio < settings.notProfitableMargin
    )
    .map((s) => ({
      id: `not-profitable-${s.product.id}`,
      type: "not-profitable" as const,
      severity: "high" as const,
      title: `${s.product.name} n'est pas rentable`,
      message: `Marge moyenne de ${(s.marginRatio * 100).toFixed(1)}% sur ${s.unitsSold} unités vendues. Il vaut mieux ne plus racheter ce produit ou revoir son prix.`,
      productId: s.product.id,
    }));

// 4. Vente anormale (profit trop élevé par rapport à l'historique du produit)
const detectAbnormalProfit = (
  stats: ProductStats[],
  now: Date,
  settings: SuggestionSettings
): Suggestion[] => {
  const suggestions: Suggestion[] = [];
  for (const s of stats) {
    if (s.marginRatio <= 0 || s.sales.length < settings.minSampleSize) continue;
    const todaySales = s.sales.filter((sale) =>
      isSameDay(new Date(sale.saleDate), now)
    );
    for (const sale of todaySales) {
      const saleMargin =
        sale.salePrice > 0
          ? (sale.salePrice - s.product.purchasePrice) / sale.salePrice
          : 0;
      if (saleMargin > s.marginRatio * settings.abnormalProfitMultiplier) {
        suggestions.push({
          id: `abnormal-profit-${sale.id}`,
          type: "abnormal-profit",
          severity: "high",
          title: `Vente suspecte sur ${s.product.name}`,
          message: `Marge de ${(saleMargin * 100).toFixed(0)}% sur cette vente, largement au-dessus de la moyenne habituelle (${(s.marginRatio * 100).toFixed(0)}%). À vérifier (erreur de saisie ou prix mal appliqué).`,
          productId: s.product.id,
        });
      }
    }
  }
  return suggestions;
};

// 5. Stock faible avec forte vélocité de vente
const detectLowStockFast = (
  stats: ProductStats[],
  now: Date,
  settings: SuggestionSettings
): Suggestion[] =>
  stats
    .filter((s) => {
      if (s.product.quantity === 0 || s.product.quantity > settings.lowStockQty)
        return false;
      const recentUnits = s.sales
        .filter(
          (sale) =>
            daysBetween(now, new Date(sale.saleDate)) <=
            settings.recentSaleWindowDays
        )
        .reduce((sum, sale) => sum + sale.quantity, 0);
      return recentUnits >= settings.lowStockVelocityMinUnits;
    })
    .map((s) => ({
      id: `low-stock-fast-${s.product.id}`,
      type: "low-stock-fast" as const,
      severity: "medium" as const,
      title: `Stock faible : ${s.product.name}`,
      message: `Il reste ${s.product.quantity} unité(s) et ce produit se vend vite. Pensez à réapprovisionner en priorité.`,
      productId: s.product.id,
    }));

// 6. Vente à crédit qui traîne
const detectCreditOverdue = (
  sales: Sale[],
  products: Product[],
  now: Date,
  settings: SuggestionSettings
): Suggestion[] => {
  const productMap = new Map(products.map((p) => [p.id, p]));
  return sales
    .filter(
      (sale) =>
        sale.isCredit === true &&
        daysBetween(now, new Date(sale.saleDate)) > settings.creditOverdueDays
    )
    .map((sale) => {
      const product = productMap.get(sale.productId);
      const days = daysBetween(now, new Date(sale.saleDate));
      return {
        id: `credit-overdue-${sale.id}`,
        type: "credit-overdue" as const,
        severity: "medium" as const,
        title: `Crédit impayé depuis ${days} jours`,
        message: `${sale.clientName ?? "Un client"} doit ${money(sale.totalAmount)} pour ${product?.name ?? "un produit"} depuis ${days} jours. Pensez à relancer.`,
        productId: sale.productId,
      };
    });
};

// 7. Tendance profit en baisse (aujourd'hui vs moyenne des derniers jours)
const detectProfitTrendDown = (
  sales: Sale[],
  products: Product[],
  now: Date,
  settings: SuggestionSettings
): Suggestion[] => {
  const productMap = new Map(products.map((p) => [p.id, p]));
  const profitOf = (list: Sale[]) =>
    list.reduce((sum, sale) => {
      const product = productMap.get(sale.productId);
      if (!product) return sum;
      return sum + (sale.totalAmount - sale.quantity * product.purchasePrice);
    }, 0);

  const todaySales = sales.filter((sale) =>
    isSameDay(new Date(sale.saleDate), now)
  );
  const pastSales = sales.filter((sale) => {
    const d = daysBetween(now, new Date(sale.saleDate));
    return d > 0 && d <= settings.profitTrendWindowDays;
  });

  if (!pastSales.length) return [];

  const todayProfit = profitOf(todaySales);
  const avgPastProfit = profitOf(pastSales) / settings.profitTrendWindowDays;

  if (
    avgPastProfit <= 0 ||
    todayProfit >= avgPastProfit * settings.profitTrendDropRatio
  )
    return [];

  return [
    {
      id: "profit-trend-down",
      type: "profit-trend-down",
      severity: "medium",
      title: "Le profit ralentit",
      message: `Profit du jour (${money(todayProfit)}) nettement en dessous de la moyenne des ${settings.profitTrendWindowDays} derniers jours (${money(avgPastProfit)}).`,
    },
  ];
};

// 8. Quantité anormale sur une vente récente
const detectAbnormalQuantity = (
  stats: ProductStats[],
  now: Date,
  settings: SuggestionSettings
): Suggestion[] => {
  const suggestions: Suggestion[] = [];
  for (const s of stats) {
    if (s.sales.length < settings.minSampleSize) continue;
    const recentSales = s.sales.filter(
      (sale) =>
        daysBetween(now, new Date(sale.saleDate)) <= settings.abnormalQtyWindowDays
    );
    for (const sale of recentSales) {
      const others = s.sales.filter((other) => other.id !== sale.id);
      const avgOthers = mean(others.map((o) => o.quantity));
      if (
        avgOthers > 0 &&
        sale.quantity > avgOthers * settings.abnormalQtyMultiplier
      ) {
        suggestions.push({
          id: `abnormal-quantity-${sale.id}`,
          type: "abnormal-quantity",
          severity: "medium",
          title: `Quantité inhabituelle sur ${s.product.name}`,
          message: `Une vente de ${sale.quantity} unités alors que la moyenne habituelle est de ${avgOthers.toFixed(1)}. À vérifier (grosse commande ou erreur de saisie).`,
          productId: s.product.id,
        });
      }
    }
  }
  return suggestions;
};

// 9. Dérive de prix (prix de vente incohérent d'une vente à l'autre)
const detectPriceDrift = (
  stats: ProductStats[],
  settings: SuggestionSettings
): Suggestion[] =>
  stats
    .filter((s) => s.sales.length >= settings.minSampleSize)
    .map((s) => {
      const prices = s.sales.map((sale) => sale.salePrice);
      const cv = s.avgSalePrice > 0 ? stdDev(prices) / s.avgSalePrice : 0;
      return { s, cv };
    })
    .filter(({ cv }) => cv > settings.priceDriftCvThreshold)
    .map(({ s, cv }) => ({
      id: `price-drift-${s.product.id}`,
      type: "price-drift" as const,
      severity: "medium" as const,
      title: `Prix instable sur ${s.product.name}`,
      message: `Le prix de vente varie fortement d'une vente à l'autre (variation de ${(cv * 100).toFixed(0)}%). Vérifiez que le bon prix est appliqué.`,
      productId: s.product.id,
    }));

// 10. Concentration du profit sur un seul produit
const detectProfitConcentration = (
  stats: ProductStats[],
  settings: SuggestionSettings
): Suggestion[] => {
  const totalProfit = stats.reduce((sum, s) => sum + Math.max(s.profit, 0), 0);
  if (totalProfit <= 0) return [];
  const top = [...stats].sort((a, b) => b.profit - a.profit)[0];
  if (!top || top.profit <= 0) return [];
  const share = top.profit / totalProfit;
  if (share < settings.concentrationShareThreshold) return [];
  return [
    {
      id: `profit-concentration-${top.product.id}`,
      type: "profit-concentration",
      severity: "medium",
      title: `Dépendance forte à ${top.product.name}`,
      message: `${(share * 100).toFixed(0)}% du profit total vient de ce seul produit. Une rupture ou une baisse de vente serait risquée pour l'activité.`,
      productId: top.product.id,
    },
  ];
};

// 11. Stock mort (produit en stock qui ne se vend plus / jamais vendu)
const detectDeadStock = (
  stats: ProductStats[],
  now: Date,
  settings: SuggestionSettings
): Suggestion[] =>
  stats
    .filter((s) => {
      if (s.product.quantity === 0) return false;
      const createdAt = s.product.createdAt
        ? new Date(s.product.createdAt)
        : null;
      if (createdAt && daysBetween(now, createdAt) < settings.deadStockDays)
        return false;
      if (!s.lastSaleDate) return true;
      return daysBetween(now, s.lastSaleDate) > settings.deadStockDays;
    })
    .map((s) => ({
      id: `dead-stock-${s.product.id}`,
      type: "dead-stock" as const,
      severity: "low" as const,
      title: `${s.product.name} ne se vend plus`,
      message: `Aucune vente depuis plus de ${settings.deadStockDays} jours alors qu'il reste ${s.product.quantity} unité(s) en stock. Envisagez une promotion.`,
      productId: s.product.id,
    }));

// 12. Stock survalorisé (capital immobilisé, rotation lente)
const detectOvervaluedStock = (
  stats: ProductStats[],
  settings: SuggestionSettings
): Suggestion[] =>
  [...stats]
    .map((s) => ({ s, stockValue: s.product.quantity * s.product.purchasePrice }))
    .filter(
      ({ s }) =>
        s.product.quantity > 0 &&
        s.product.quantity > s.unitsSold * settings.overvaluedRotationMultiplier
    )
    .sort((a, b) => b.stockValue - a.stockValue)
    .slice(0, settings.overvaluedTopN)
    .map(({ s, stockValue }) => ({
      id: `overvalued-stock-${s.product.id}`,
      type: "overvalued-stock" as const,
      severity: "low" as const,
      title: `Capital immobilisé sur ${s.product.name}`,
      message: `${money(stockValue)} de stock dorment sur ce produit à faible rotation. Cela immobilise votre trésorerie.`,
      productId: s.product.id,
    }));

// 13. Pic de vente inhabituel aujourd'hui
const detectSalesSpike = (
  stats: ProductStats[],
  now: Date,
  settings: SuggestionSettings
): Suggestion[] => {
  const suggestions: Suggestion[] = [];
  for (const s of stats) {
    const todayUnits = s.sales
      .filter((sale) => isSameDay(new Date(sale.saleDate), now))
      .reduce((sum, sale) => sum + sale.quantity, 0);
    if (todayUnits === 0) continue;

    const daysWithSales = new Set(
      s.sales
        .filter((sale) => !isSameDay(new Date(sale.saleDate), now))
        .map((sale) => new Date(sale.saleDate).toDateString())
    ).size;
    if (daysWithSales < settings.minSampleSize) continue;

    const pastUnits = s.sales
      .filter((sale) => !isSameDay(new Date(sale.saleDate), now))
      .reduce((sum, sale) => sum + sale.quantity, 0);
    const avgDailyUnits = pastUnits / daysWithSales;

    if (
      avgDailyUnits > 0 &&
      todayUnits > avgDailyUnits * settings.salesSpikeMultiplier
    ) {
      suggestions.push({
        id: `sales-spike-${s.product.id}`,
        type: "sales-spike",
        severity: "low",
        title: `Pic de vente sur ${s.product.name}`,
        message: `${todayUnits} unités vendues aujourd'hui contre ${avgDailyUnits.toFixed(1)} en moyenne. Surveillez le stock, une rupture pourrait arriver vite.`,
        productId: s.product.id,
      });
    }
  }
  return suggestions;
};

// 14. Meilleur / pire produit du mois en cours
const detectMonthlyBestWorst = (stats: ProductStats[], now: Date): Suggestion[] => {
  const monthStats = stats.filter((s) =>
    s.sales.some((sale) => {
      const d = new Date(sale.saleDate);
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    })
  );
  if (!monthStats.length) return [];

  const withMonthProfit = monthStats.map((s) => {
    const monthSales = s.sales.filter((sale) => {
      const d = new Date(sale.saleDate);
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    });
    const monthProfit = monthSales.reduce(
      (sum, sale) => sum + (sale.totalAmount - sale.quantity * s.product.purchasePrice),
      0
    );
    return { s, monthProfit };
  });

  const best = [...withMonthProfit].sort((a, b) => b.monthProfit - a.monthProfit)[0];
  const worst = [...withMonthProfit].sort((a, b) => a.monthProfit - b.monthProfit)[0];

  const suggestions: Suggestion[] = [];
  if (best && best.monthProfit > 0) {
    suggestions.push({
      id: `monthly-best-${best.s.product.id}`,
      type: "monthly-best-worst",
      severity: "low",
      title: `Meilleur produit du mois : ${best.s.product.name}`,
      message: `${money(best.monthProfit)} de profit ce mois-ci. Assurez-vous d'en garder suffisamment en stock.`,
      productId: best.s.product.id,
    });
  }
  if (worst && worst.monthProfit < 0 && worst.s.product.id !== best?.s.product.id) {
    suggestions.push({
      id: `monthly-worst-${worst.s.product.id}`,
      type: "monthly-best-worst",
      severity: "low",
      title: `Produit à revoir ce mois : ${worst.s.product.name}`,
      message: `${money(worst.monthProfit)} de profit ce mois-ci. Ce produit tire les résultats vers le bas.`,
      productId: worst.s.product.id,
    });
  }
  return suggestions;
};

export const getSuggestions = ({
  products,
  sales,
  settings = DEFAULT_SUGGESTION_SETTINGS,
  filters,
}: {
  products: Product[];
  sales: Sale[];
  settings?: SuggestionSettings;
  filters?: SuggestionFilters;
}): Suggestion[] => {
  const { products: p, sales: s } = applyFilters(products, sales, filters);
  const now = new Date();
  const stats = buildProductStats(p, s);

  const all: Suggestion[] = [
    ...detectLossSalesToday(stats, now),
    ...detectOutOfStock(stats, now, settings),
    ...detectNotProfitable(stats, settings),
    ...detectAbnormalProfit(stats, now, settings),
    ...detectLowStockFast(stats, now, settings),
    ...detectCreditOverdue(s, p, now, settings),
    ...detectProfitTrendDown(s, p, now, settings),
    ...detectAbnormalQuantity(stats, now, settings),
    ...detectPriceDrift(stats, settings),
    ...detectProfitConcentration(stats, settings),
    ...detectDeadStock(stats, now, settings),
    ...detectOvervaluedStock(stats, settings),
    ...detectSalesSpike(stats, now, settings),
    ...detectMonthlyBestWorst(stats, now),
  ];

  const priorityIndex = new Map(PRIORITY_ORDER.map((type, i) => [type, i]));
  const sorted = all.sort(
    (a, b) => (priorityIndex.get(a.type) ?? 99) - (priorityIndex.get(b.type) ?? 99)
  );

  return filters?.type ? sorted.filter((sug) => sug.type === filters.type) : sorted;
};
