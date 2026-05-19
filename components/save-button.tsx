import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export function SaveButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.saveBtn} onPress={onPress}>
      <Ionicons name="save" size={20} color="#FFFFFF" />
      <Text style={styles.saveText}>Enregistrer</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  saveBtn: {
    backgroundColor: "#F97316",
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    shadowColor: "rgba(249,115,22,0.45)",
    shadowOpacity: 1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  saveText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});
