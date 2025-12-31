import { Colors } from "@/constants/theme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export function AddButton({ onPress }: { onPress: () => void }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.iconButton} onPress={onPress}>
        <MaterialIcons name="add-circle" size={32} color={Colors.dark.accent} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 10,
    right: 0,
  },

  iconButton: {
    padding: 10,
    backgroundColor: Colors.dark.primary,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: Colors.dark.primary,
    alignItems: "center",
    justifyContent: "center",
  },
});
