import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export function CancelButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.cancelBtn} onPress={onPress}>
      <Ionicons name="close-circle" size={20} color={Colors.dark.danger} />
      <Text style={styles.cancelText}>Annuler</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cancelBtn: {
    backgroundColor: "rgba(244,63,94,0.08)",
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(244,63,94,0.25)",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cancelText: {
    color: "#F43F5E",
    fontSize: 15,
    fontWeight: "700",
  },
});
