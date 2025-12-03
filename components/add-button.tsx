import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

export function AddButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.addBtn} onPress={onPress}>
      <Ionicons name="add-circle" size={60} color="#1F2937" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  addBtn: {
    width: 60,
    height: 60,
    borderColor: "#10B981",
    borderRadius: 50,
  },
  addText: {
    color: "#10B981",
    fontSize: 15,
    fontWeight: "600",
  },
});
