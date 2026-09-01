import { SuggestionSettings } from "@/interface/suggestion";

export type SuggestionFieldKey = keyof SuggestionSettings;

export interface SuggestionFieldDefinition {
  key: SuggestionFieldKey;
  label: string;
  description: string;
  unit: string;
  isPercent?: boolean;
}

export interface SuggestionFieldGroup {
  title: string;
  fields: SuggestionFieldDefinition[];
}

export const SUGGESTION_FIELD_GROUPS: SuggestionFieldGroup[] = [
  {
    title: "Stock",
    fields: [
      {
        key: "lowStockQty",
        label: "Seuil stock faible",
        description:
          "Quantité en stock en dessous de laquelle un produit est considéré comme en stock faible. Utilisé par l'alerte « Stock faible ».",
        unit: "unités",
      },
      {
        key: "recentSaleWindowDays",
        label: "Fenêtre pour juger une vente/rupture récente",
        description:
          "Nombre de jours utilisés pour juger qu'une vente ou une rupture de stock est encore récente. Utilisé par les alertes « Rupture de stock » et « Stock faible ».",
        unit: "jours",
      },
      {
        key: "lowStockVelocityMinUnits",
        label: "Unités vendues (sur la fenêtre) pour alerter",
        description:
          "Nombre d'unités vendues sur la fenêtre récente à partir duquel un stock faible est jugé prioritaire, car le produit se vend vite.",
        unit: "unités",
      },
      {
        key: "deadStockDays",
        label: "Jours sans vente = produit jamais vendu",
        description:
          "Nombre de jours sans aucune vente au-delà duquel un produit en stock est considéré comme jamais vendu (stock mort).",
        unit: "jours",
      },
    ],
  },
  {
    title: "Rentabilité",
    fields: [
      {
        key: "notProfitableMargin",
        label: "Marge minimum acceptable",
        description:
          "Marge en dessous de laquelle un produit est jugé pas rentable et ne devrait plus être racheté tel quel.",
        unit: "%",
        isPercent: true,
      },
      {
        key: "notProfitableMinUnits",
        label: "Ventes minimum avant de juger la rentabilité",
        description:
          "Nombre minimum de ventes nécessaires avant de juger la rentabilité d'un produit, pour éviter de juger sur un échantillon trop faible.",
        unit: "ventes",
      },
      {
        key: "abnormalProfitMultiplier",
        label: "Marge d'une vente = X fois la moyenne → suspecte",
        description:
          "Si la marge d'une vente dépasse ce multiple de la marge moyenne habituelle du produit, la vente est signalée comme suspecte (erreur de saisie ou prix mal appliqué).",
        unit: "x",
      },
    ],
  },
  {
    title: "Anomalies de vente",
    fields: [
      {
        key: "minSampleSize",
        label: "Ventes minimum avant calcul statistique",
        description:
          "Nombre minimum de ventes enregistrées avant d'appliquer les calculs statistiques (dérive de prix, quantité anormale, pic de vente).",
        unit: "ventes",
      },
      {
        key: "abnormalQtyWindowDays",
        label: "Fenêtre pour détecter une quantité anormale",
        description:
          "Fenêtre, en jours, sur laquelle on recherche des ventes avec une quantité anormalement élevée.",
        unit: "jours",
      },
      {
        key: "abnormalQtyMultiplier",
        label: "Quantité d'une vente = X fois la moyenne → suspecte",
        description:
          "Si la quantité d'une vente dépasse ce multiple de la quantité moyenne du produit, elle est signalée comme suspecte (grosse commande ou erreur de saisie).",
        unit: "x",
      },
      {
        key: "priceDriftCvThreshold",
        label: "Variation de prix jugée instable",
        description:
          "Seuil de variation du prix de vente d'un produit au-delà duquel le prix est jugé instable d'une vente à l'autre.",
        unit: "%",
        isPercent: true,
      },
      {
        key: "salesSpikeMultiplier",
        label: "Ventes du jour = X fois la moyenne → pic",
        description:
          "Si les ventes du jour dépassent ce multiple de la moyenne quotidienne habituelle du produit, un pic de vente est signalé.",
        unit: "x",
      },
    ],
  },
  {
    title: "Finance",
    fields: [
      {
        key: "creditOverdueDays",
        label: "Jours avant de signaler un crédit impayé",
        description:
          "Nombre de jours après lesquels une vente à crédit non réglée est signalée comme en retard.",
        unit: "jours",
      },
      {
        key: "profitTrendWindowDays",
        label: "Fenêtre de comparaison de la tendance",
        description:
          "Nombre de jours utilisés pour calculer la moyenne de profit servant de référence de comparaison.",
        unit: "jours",
      },
      {
        key: "profitTrendDropRatio",
        label: "Seuil de chute du profit du jour",
        description:
          "Si le profit du jour est en dessous de ce pourcentage de la moyenne de référence, une baisse de tendance est signalée.",
        unit: "%",
        isPercent: true,
      },
      {
        key: "concentrationShareThreshold",
        label: "Part du profit sur 1 produit jugée risquée",
        description:
          "Part du profit total reposant sur un seul produit à partir de laquelle une dépendance risquée est signalée.",
        unit: "%",
        isPercent: true,
      },
    ],
  },
  {
    title: "Stock immobilisé",
    fields: [
      {
        key: "overvaluedTopN",
        label: "Nombre de produits à remonter",
        description:
          "Nombre maximum de produits remontés dans l'alerte « Stock immobilisé », triés par valeur de stock décroissante.",
        unit: "produits",
      },
      {
        key: "overvaluedRotationMultiplier",
        label: "Stock = X fois les ventes → rotation lente",
        description:
          "Si le stock restant dépasse ce multiple des ventes réalisées, la rotation du produit est jugée trop lente et son capital immobilisé.",
        unit: "x",
      },
    ],
  },
];
