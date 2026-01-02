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
    backgroundColor: Colors.dark.card, // surface sombre
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  cancelText: {
    color: Colors.dark.danger, // texte rouge
    fontSize: 15,
    fontWeight: "800",
  },
});
