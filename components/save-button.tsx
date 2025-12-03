import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export function SaveButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.saveBtn} onPress={onPress}>
      <Ionicons name="save" size={20} color="#3B82F6" />
      <Text style={styles.saveText}>Enregistrer</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  saveBtn: {
    backgroundColor: "#1F2937",
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  saveText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "800",
  },
});
