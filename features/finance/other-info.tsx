import { useFinance } from "@/hooks/finance/useFinance";
import { Product } from "@/interface/product/product";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import SkeletonOtherInfo from "./skeleton-other-info";

const TopSodl = ({
  title,
  data,
  icon,
  color,
}: {
  title: string;
  data?: { product: Product; sold: number }[];
  icon: string | any;
  color: string;
}) => {
  if (!data) return <></>;
  return (
    <>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.blockContainer}>
        {data.map((item, index) => (
          <View style={styles.miniBlock} key={item.product.id + index}>
            <View style={[styles.iconCircle, { backgroundColor: color + "26" }]}>
              <Feather name={icon} size={18} color={color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.blockTitle}>{item.product.name}</Text>
              <Text style={styles.blockValue}>{`${item.sold}`}</Text>
            </View>
          </View>
        ))}
      </View>
    </>
  );
};

const MiniBlockList = ({
  title,
  icon,
  color,
  data,
  valueKey,
  isDate,
}: {
  title: string;
  icon: string;
  color: string;
  data?: Product[];
  valueKey: string;
  isDate?: boolean;
}) => {
  if (!data) return <></>;
  return (
    <>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.blockContainer}>
        {data.map((item: any, index) => (
          <View style={styles.miniBlock} key={index}>
            <View style={[styles.iconCircle, { backgroundColor: color + "26" }]}>
              <Feather name={icon as any} size={18} color={color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.blockTitle}>{item.name}</Text>
              <Text style={styles.blockValue}>
                {isDate
                  ? new Date(item[valueKey]).toLocaleDateString()
                  : item[valueKey] +
                    (valueKey === "purchasePrice" ? " Ar" : "")}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </>
  );
};

function OtherInfo() {
  const {
    topSoldProducts,
    leastSoldProducts,
    mostExpensiveProducts,
    leastExpensiveProducts,
    newestProducts,
    oldestProducts,
    loading,
  } = useFinance();

  const topSoldConfig = [
    {
      title: "Top 5 — Produits les plus vendus",
      icon: "arrow-up",
      color: "#3B82F6",
      data: topSoldProducts,
    },
    {
      title: "Top 5 — Produits les moins vendus",
      icon: "arrow-down",
      color: "#F43F5E",
      data: leastSoldProducts,
    },
  ];

  const otherInfoListsConfig = [
    {
      title: "Produits les plus chers",
      icon: "dollar-sign",
      color: "#2ECC71",
      data: mostExpensiveProducts,
      valueKey: "purchasePrice",
    },
    {
      title: "Produits les moins chers",
      icon: "tag",
      color: "#F5B544",
      data: leastExpensiveProducts,
      valueKey: "purchasePrice",
    },
    {
      title: "Nouveaux produits",
      icon: "clock",
      color: "#8B5CF6",
      data: newestProducts,
      valueKey: "createdAt",
      isDate: true,
    },
    {
      title: "Produits anciens (stock)",
      icon: "archive",
      color: "#7A83A2",
      data: oldestProducts,
      valueKey: "createdAt",
      isDate: true,
    },
  ];

  if (loading) return <SkeletonOtherInfo />;

  return (
    <>
      {topSoldConfig.map((topSold) => (
        <TopSodl key={topSold.title} {...topSold} />
      ))}
      {otherInfoListsConfig.map((other, index) => (
        <MiniBlockList key={other.valueKey + index} {...other} />
      ))}
    </>
  );
}

export default OtherInfo;

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 24,
    marginBottom: 10,
    color: "#F4F6FF",
    letterSpacing: -0.3,
  },
  blockContainer: {
    width: "100%",
  },
  miniBlock: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    marginBottom: 6,
    backgroundColor: "#141B33",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  blockTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#F4F6FF",
  },
  blockValue: {
    fontSize: 13,
    color: "#22D3EE",
    fontWeight: "500",
    marginTop: 2,
  },
});
