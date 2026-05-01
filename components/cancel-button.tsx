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
    backgroundColor: "rgba(255,255,255,0.06)",
    paddingVertical: 11,
    paddingHorizontal: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  cancelText: {
    color: Colors.dark.danger,
    fontSize: 15,
    fontWeight: "700",
  },
});
