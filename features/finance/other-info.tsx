import { Colors } from "@/constants/theme";
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
            <View style={[styles.iconCircle, { backgroundColor: color }]}>
              <Feather name={icon} size={18} color="white" />
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
            <View style={[styles.iconCircle, { backgroundColor: color }]}>
              <Feather name={icon as any} size={18} color="white" />
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
      title: "Top 5 - Produits les plus vendus",
      icon: "arrow-up",
      color: "#0EA5E9",
      data: topSoldProducts,
    },
    {
      title: "Top 5 - Produits les moins vendus",
      icon: "arrow-down",
      color: "#EF4444",
      data: leastSoldProducts,
    },
  ];

  const otherInfoListsConfig = [
    {
      title: "Produits les plus chers",
      icon: "dollar-sign",
      color: "#16A34A",
      data: mostExpensiveProducts,
      valueKey: "purchasePrice",
    },
    {
      title: "Produits les moins chers",
      icon: "tag",
      color: "#F59E0B",
      data: leastExpensiveProducts,
      valueKey: "purchasePrice",
    },
    {
      title: "Nouveaux produits",
      icon: "clock",
      color: "#6366F1",
      data: newestProducts,
      valueKey: "createdAt",
      isDate: true,
    },
    {
      title: "Produits anciens (stock)",
      icon: "archive",
      color: "#475569",
      data: oldestProducts,
      valueKey: "createdAt",
      isDate: true,
    },
  ];

  if (loading) return <SkeletonOtherInfo />;

  return (
    <>
      {topSoldConfig.map((topSold) => (
        <TopSodl key={topSold.title} {...{ ...topSold }} />
      ))}
      {otherInfoListsConfig.map((other, index) => (
        <MiniBlockList key={other.valueKey + index} {...{ ...other }} />
      ))}
    </>
  );
}

export default OtherInfo;

/* -------------------
   STYLES
--------------------*/

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginTop: 25,
    marginBottom: 10,
    color: "#FFFFFF",
  },

  blockContainer: {
    width: "100%",
  },

  miniBlock: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginBottom: 8,
    backgroundColor: "#0F1535",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    shadowColor: "rgba(0,212,255,0.06)",
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },

  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  blockTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  blockValue: {
    fontSize: 13,
    color: "#00D4FF",
  },
});
