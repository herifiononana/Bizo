import { Product } from "@/interface/product/product";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import DeleteProductButton from "./delete-product-button";
import EditProductButton from "./edit-product-button";

function getStockBadge(qty: number): { label: string; color: string; bg: string } {
  if (qty === 0) return { label: "Rupture", color: "#F43F5E", bg: "rgba(244,63,94,0.12)" };
  if (qty <= 3) return { label: "Faible", color: "#F5B544", bg: "rgba(245,181,68,0.12)" };
  return { label: `${qty} en stock`, color: "#3B82F6", bg: "rgba(59,130,246,0.12)" };
}

const ProductListItem = React.memo(function ProductListItem({
  item,
}: {
  item: Product;
}) {
  const stockBadge = getStockBadge(item.quantity);

  const marginPct =
    item.purchasePrice > 0 && item.salePrice
      ? (((item.salePrice - item.purchasePrice) / item.purchasePrice) * 100).toFixed(1)
      : null;

  const marginPositive = marginPct !== null && Number(marginPct) >= 0;

  const marginUnit =
    item.salePrice && item.purchasePrice
      ? item.salePrice - item.purchasePrice
      : null;

  return (
      <View style={styles.card}>
        {/* Top row: icon + name + badges | edit + delete */}
        <View style={styles.topRow}>
          <View style={styles.iconWrap}>
            <Ionicons name="cube-outline" size={20} color="#3B82F6" />
          </View>
          <View style={styles.nameCol}>
            <Text style={styles.productName}>{item.name}</Text>
            <View style={styles.badgesRow}>
              <View style={[styles.stockBadge, { backgroundColor: stockBadge.bg }]}>
                <Text style={[styles.stockBadgeText, { color: stockBadge.color }]}>
                  {stockBadge.label}
                </Text>
              </View>
              {marginPct !== null && (
                <View
                  style={[
                    styles.marginBadge,
                    {
                      backgroundColor: marginPositive
                        ? "rgba(46,204,113,0.10)"
                        : "rgba(244,63,94,0.10)",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.marginBadgeText,
                      { color: marginPositive ? "#2ECC71" : "#F43F5E" },
                    ]}
                  >
                    {marginPositive ? "+" : ""}
                    {marginPct} %
                  </Text>
                </View>
              )}
            </View>
          </View>
          <View style={styles.actions}>
            <EditProductButton product={item} />
            <DeleteProductButton item={item} />
          </View>
        </View>

        {/* Prices row */}
        <View style={styles.pricesRow}>
          <View style={styles.priceBlock}>
            <Text style={styles.priceLabel}>PRIX D'ACHAT</Text>
            <Text style={[styles.priceValue, { color: "#F43F5E" }]}>
              {item.purchasePrice.toLocaleString()} Ar
            </Text>
          </View>
          <View style={styles.priceDivider} />
          <View style={styles.priceBlock}>
            <Text style={styles.priceLabel}>PRIX DE VENTE</Text>
            <Text style={[styles.priceValue, { color: "#2ECC71" }]}>
              {item.salePrice ? item.salePrice.toLocaleString() : "—"} Ar
            </Text>
          </View>
          <View style={styles.priceDivider} />
          <View style={styles.priceBlock}>
            <Text style={styles.priceLabel}>MARGE UNIT.</Text>
            <Text
              style={[
                styles.priceValue,
                { color: marginUnit && marginUnit >= 0 ? "#2ECC71" : "#F43F5E" },
              ]}
            >
              {marginUnit !== null ? marginUnit.toLocaleString() : "—"} Ar
            </Text>
          </View>
        </View>
      </View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#141B33",
    borderRadius: 22,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 14,
    gap: 10,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(59,130,246,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  nameCol: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    color: "#F4F6FF",
    fontWeight: "700",
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  badgesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  stockBadge: {
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  stockBadgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  marginBadge: {
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  marginBadgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  actions: {
    flexDirection: "row",
    gap: 6,
  },
  pricesRow: {
    flexDirection: "row",
    backgroundColor: "#1B2342",
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.04)",
  },
  priceBlock: {
    flex: 1,
    alignItems: "center",
  },
  priceDivider: {
    width: 1,
    backgroundColor: "rgba(255,255,255,0.07)",
    marginVertical: 2,
  },
  priceLabel: {
    fontSize: 10,
    color: "#545C7A",
    fontWeight: "700",
    letterSpacing: 0.3,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
});

export default ProductListItem;
