import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type ProductSelectionHeaderProps = {
  selectedCount: number;
  allSelected: boolean;
  onSelectAll: () => void;
  onClear: () => void;
  onClose: () => void;
};

const ProductSelectionHeader = ({
  selectedCount,
  allSelected,
  onSelectAll,
  onClear,
  onClose,
}: ProductSelectionHeaderProps) => (
  <View style={styles.row}>
    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
      <Ionicons name="close" size={22} color="#F4F6FF" />
    </TouchableOpacity>
    <Text style={styles.count}>
      {selectedCount} sélectionné{selectedCount > 1 ? "s" : ""}
    </Text>
    <TouchableOpacity onPress={allSelected ? onClear : onSelectAll}>
      <Text style={styles.action}>
        {allSelected ? "Tout désélectionner" : "Tout sélectionner"}
      </Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
    paddingRight: 60,
  },
  closeButton: {
    padding: 6,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  count: {
    flex: 1,
    fontSize: 20,
    fontWeight: "800",
    color: "#F4F6FF",
  },
  action: {
    color: "#3B82F6",
    fontSize: 13,
    fontWeight: "700",
  },
});

export default ProductSelectionHeader;
