import { Colors } from "@/constants/theme";
import { useFinance } from "@/hooks/finance/useFinance";
import { Product } from "@/interface/product/product";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const TopSodl = ({
  title,
  data,
  icon,
  color,
}: {
  title: string;
  data: { product: Product; sold: number }[];
  icon: string | any;
  color: string;
}) => (
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
  data: Product[];
  valueKey: string;
  isDate?: boolean;
}) => (
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
                : item[valueKey] + (valueKey === "purchasePrice" ? " Ar" : "")}
            </Text>
          </View>
        </View>
      ))}
    </View>
  </>
);

function OtherInfo() {
  const {
    topSoldProducts,
    leastSoldProducts,
    mostExpensiveProducts,
    leastExpensiveProducts,
    newestProducts,
    oldestProducts,
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
// const styles = StyleSheet.create({
//   /* LISTE DYNAMIQUE */
//   sectionTitle: {
//     fontSize: 17,
//     fontWeight: "700",
//     marginTop: 25,
//     marginBottom: 10,
//     color: "#0F172A",
//   },

//   blockContainer: {
//     width: "100%",
//   },

//   miniBlock: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 6,
//     marginBottom: 4,
//     backgroundColor: "#FFF",
//     borderRadius: 14,
//     shadowColor: "#000",
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 2,
//   },

//   iconCircle: {
//     width: 32,
//     height: 32,
//     borderRadius: 50,
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 12,
//   },

//   blockTitle: {
//     fontSize: 15,
//     fontWeight: "600",
//     color: "#0F172A",
//   },

//   blockValue: {
//     fontSize: 13,
//     color: "#475569",
//   },
// });

const styles = StyleSheet.create({
  /* TITRE DES SECTIONS */
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginTop: 25,
    marginBottom: 10,
    color: Colors.dark.text,
  },

  /* CONTAINER */
  blockContainer: {
    width: "100%",
  },

  /* BLOC PRINCIPAL */
  miniBlock: {
    flexDirection: "row",
    alignItems: "center",

    padding: 8,
    marginBottom: 6,

    backgroundColor: Colors.dark.surface,
    borderRadius: 14,

    shadowColor: Colors.dark.shadow,
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },

  /* ICÔNE */
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  /* NOM DU PRODUIT */
  blockTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.dark.text,
  },

  /* VALEURS (prix, nombre, date…) */
  blockValue: {
    fontSize: 13,
    color: Colors.dark.accent,
  },
});
