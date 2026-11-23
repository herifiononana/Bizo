import { Reference } from "@/interface/reference";
import { Entypo } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type ReferenceListRowProps = {
  reference: Reference;
  onEdit: () => void;
  onDelete: () => void;
};

const ReferenceListRow = ({ reference, onEdit, onDelete }: ReferenceListRowProps) => (
  <View style={styles.listRow}>
    <Text style={styles.listRowName}>{reference.name}</Text>
    <View style={styles.listRowActions}>
      <TouchableOpacity style={styles.listRowBtn} onPress={onEdit}>
        <Entypo name="edit" size={15} color="#B7BFD8" />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.listRowBtn, styles.listRowBtnDanger]}
        onPress={onDelete}
      >
        <Entypo name="trash" size={15} color="#F43F5E" />
      </TouchableOpacity>
    </View>
  </View>
);

export default ReferenceListRow;

const styles = StyleSheet.create({
  listRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1B2342",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    paddingVertical: 8,
    paddingHorizontal: 11,
    marginBottom: 6,
  },
  listRowName: {
    flex: 1,
    color: "#F4F6FF",
    fontWeight: "600",
    fontSize: 14,
  },
  listRowActions: {
    flexDirection: "row",
    gap: 6,
  },
  listRowBtn: {
    padding: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  listRowBtnDanger: {
    backgroundColor: "rgba(244,63,94,0.10)",
    borderWidth: 1,
    borderColor: "rgba(244,63,94,0.25)",
  },
});
