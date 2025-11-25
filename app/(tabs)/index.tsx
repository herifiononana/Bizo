import { useFinance } from "@/hooks/finance/useFinance";
import { Product } from "@/interface/product/product";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";

const Dashboard = () => {
  const {
    data,
    topSoldProducts,
    leastSoldProducts,
    mostExpensiveProducts,
    leastExpensiveProducts,
    newestProducts,
    oldestProducts,
  } = useFinance();

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <Text style={styles.title}>Tableau de bord</Text>
        <Text style={styles.subtitle}>Vue d’ensemble de votre activité</Text>

        {/* CARDS PRINCIPALES */}
        <View style={styles.statsGrid}>
          <StatCard
            label="Produits"
            value={data?.totalProducts}
            color="#E0F2FE"
            icon="inventory"
          />
          <StatCard
            label="Valeur du stock"
            value={data?.totalStockValue + " Ar"}
            color="#DCFCE7"
            icon="monetization-on"
          />
          <StatCard
            label="Ventes totales"
            value={data?.totalSalesValue + " Ar"}
            color="#FEF9C3"
            icon="show-chart"
          />
          <StatCard
            label="Ventes Cash"
            value={data?.totalCashSales + " Ar"}
            color="#D1FAE5"
            icon="payments"
          />
          <StatCard
            label="Crédit"
            value={data?.totalCreditSales + " Ar"}
            color="#FEE2E2"
            icon="credit-card"
          />
          <StatCard
            label="Bénéfice"
            value={"+" + (data?.totalProfit ?? 0) + " Ar"}
            color="#BBF7D0"
            icon="trending-up"
          />
        </View>

        {/* LISTES DYNAMIQUES */}

        <TopSodl
          title="Top 5 - Produits les plus vendus"
          icon="arrow-up"
          color="#0EA5E9"
          data={topSoldProducts}
        />

        <TopSodl
          title="Top 5 - Produits les moins vendus"
          icon="arrow-down"
          color="#EF4444"
          data={leastSoldProducts}
        />

        <MiniBlockList
          title="Produits les plus chers"
          icon="dollar-sign"
          color="#16A34A"
          data={mostExpensiveProducts}
          valueKey="purchasePrice"
        />

        <MiniBlockList
          title="Produits les moins chers"
          icon="tag"
          color="#F59E0B"
          data={leastExpensiveProducts}
          valueKey="purchasePrice"
        />

        <MiniBlockList
          title="Nouveaux produits"
          icon="clock"
          color="#6366F1"
          data={newestProducts}
          valueKey="createdAt"
          isDate
        />

        <MiniBlockList
          title="Produits anciens (stock)"
          icon="archive"
          color="#475569"
          data={oldestProducts}
          valueKey="createdAt"
          isDate
        />

        <Text style={styles.footerText}>
          Mise à jour : {new Date().toLocaleDateString()}
        </Text>
      </ScrollView>
    </View>
  );
};

export default Dashboard;

/* -------------------
   COMPONENTS RÉUTILISABLES
--------------------*/

const StatCard = ({ label, value, color, icon }: any) => (
  <View style={[styles.statCard, { backgroundColor: color }]}>
    <MaterialIcons name={icon} size={26} color="#0F172A" />
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

const MiniBlockList = ({ title, icon, color, data, valueKey, isDate }: any) => (
  <>
    <Text style={styles.sectionTitle}>{title}</Text>

    <View style={styles.blockContainer}>
      {data.map((item: any) => (
        <View style={styles.miniBlock} key={item.id}>
          <View style={[styles.iconCircle, { backgroundColor: color }]}>
            <Feather name={icon} size={18} color="white" />
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
      {data.map((item) => (
        <View style={styles.miniBlock} key={item.product.id}>
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

/* -------------------
   STYLES
--------------------*/
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F8FAFC" },
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },

  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#0F172A",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#475569",
    marginBottom: 22,
    textAlign: "center",
  },

  /* CARDS */
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statCard: {
    width: "48%",
    borderRadius: 16,
    padding: 18,
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 14,
    color: "#334155",
    marginTop: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
  },

  /* LISTE DYNAMIQUE */
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginTop: 25,
    marginBottom: 10,
    color: "#0F172A",
  },

  blockContainer: {
    width: "100%",
  },

  miniBlock: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 8,
    backgroundColor: "#FFF",
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  blockTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
  },

  blockValue: {
    fontSize: 13,
    color: "#475569",
  },

  footerText: {
    marginTop: 25,
    fontSize: 12,
    color: "#94A3B8",
    textAlign: "center",
  },
});
