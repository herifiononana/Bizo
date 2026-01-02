import { Colors } from "@/constants/theme";
import { Order } from "@/interface/order";
import { Entypo } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import UpdateOrderForm from "./update-order-form";

function UpdateOrderButton({ order }: { order: Order }) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <View>
        <TouchableOpacity
          style={[styles.actionBtn, styles.editBtn]}
          onPress={() => setModalVisible(true)}
        >
          <Entypo name="edit" size={18} color={Colors.dark.text} />
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} transparent animationType="slide">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.modalWrapper}
        >
          <View style={styles.modalBox}>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <UpdateOrderForm
                order={order}
                onCancel={() => setModalVisible(false)}
              />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

export default UpdateOrderButton;

const styles = StyleSheet.create({
  actionBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
  },

  editBtn: {
    borderColor: Colors.dark.border,
  },

  actionText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.dark.text,
  },

  modalWrapper: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  modalBox: {
    backgroundColor: Colors.dark.surface,
    borderRadius: 16,
    maxHeight: "90%", // 🔥 clé
  },

  scrollContent: {
    padding: 0,
    paddingBottom: 40, // pour boutons
  },
});
