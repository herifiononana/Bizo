import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  itemCount: number;
  isCredit: boolean;
  wasCreditNowPaid: boolean;
  totalAmount: number;
  formattedDate: string;
};

const SaleGroupTopRow = React.memo(function SaleGroupTopRow({
  itemCount,
  isCredit,
  wasCreditNowPaid,
  totalAmount,
  formattedDate,
}: Props) {
  return (
    <View style={styles.topRow}>
      <View style={styles.nameRow}>
        <View style={styles.multiChip}>
          <MaterialIcons name="layers" size={12} color="#A78BFA" />
          <Text style={styles.multiChipText}>{itemCount} produits</Text>
        </View>
        {isCredit ? (
          <View style={styles.badgeCredit}>
            <View style={styles.dot} />
            <Text style={styles.badgeCreditText}>Crédit</Text>
          </View>
        ) : wasCreditNowPaid ? (
          <View style={styles.badgePaid}>
            <View style={[styles.dot, { backgroundColor: "#2ECC71" }]} />
            <Text style={styles.badgePaidText}>Payé</Text>
          </View>
        ) : (
          <View style={styles.badgeCash}>
            <View style={[styles.dot, { backgroundColor: "#22D3EE" }]} />
            <Text style={styles.badgeCashText}>Cash</Text>
          </View>
        )}
      </View>
      <View style={styles.rightCol}>
        <Text style={styles.saleTotal}>
          {totalAmount.toLocaleString()} Ar
        </Text>
        <Text style={styles.saleDate}>{formattedDate}</Text>
      </View>
    </View>
  );
});

export default SaleGroupTopRow;

const styles = StyleSheet.create({
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    flexWrap: "wrap",
    gap: 8,
  },
  rightCol: {
    alignItems: "flex-end",
    marginLeft: 8,
  },
  multiChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(167,139,250,0.12)",
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
    gap: 4,
  },
  multiChipText: {
    fontSize: 12,
    color: "#A78BFA",
    fontWeight: "700",
  },
  saleTotal: {
    fontSize: 18,
    color: "#2ECC71",
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  saleDate: {
    fontSize: 12,
    color: "#7A83A2",
    fontWeight: "500",
    marginTop: 2,
  },
  badgeCredit: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(249,115,22,0.12)",
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
    gap: 4,
  },
  badgeCreditText: {
    fontSize: 12,
    color: "#FB923C",
    fontWeight: "700",
  },
  badgePaid: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(46,204,113,0.12)",
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
    gap: 4,
  },
  badgePaidText: {
    fontSize: 12,
    color: "#2ECC71",
    fontWeight: "700",
  },
  badgeCash: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(34,211,238,0.10)",
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
    gap: 4,
  },
  badgeCashText: {
    fontSize: 12,
    color: "#22D3EE",
    fontWeight: "700",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FB923C",
  },
});
