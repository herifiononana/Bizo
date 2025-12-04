import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

export function AddButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.addBtn} onPress={onPress}>
      <Ionicons name="add-circle" size={60} color={Colors.dark.accent} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  addBtn: {
    width: 60,
    height: 60,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.dark.surface, // fond sombre pour le bouton
    shadowColor: Colors.dark.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4, // pour Android
  },
});
