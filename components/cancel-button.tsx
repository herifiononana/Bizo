import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export function CancelButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.cancelBtn} onPress={onPress}>
      <Ionicons name="close-circle" size={20} color="#F87171" />
      <Text style={styles.cancelText}>Annuler</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cancelBtn: {
    backgroundColor: "#1F2937",
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  cancelText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "800",
  },
});
