import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export function SaveButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.saveBtn} onPress={onPress}>
      <Ionicons name="save" size={20} color={Colors.dark.text} />
      <Text style={styles.saveText}>Enregistrer</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  saveBtn: {
    backgroundColor: Colors.dark.card,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  saveText: {
    color: Colors.dark.text, // texte clair
    fontSize: 15,
    fontWeight: "800",
  },
});
