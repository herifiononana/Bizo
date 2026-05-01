import { Colors } from "@/constants/theme";
import { Product } from "@/interface/product/product";
import { Entypo } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import DeleteProductButton from "./delete-product-button";
import EditProductForm from "./edit-product-form";

function ProductListItem({ item }: { item: Product }) {
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  return (
    <>
      <View style={styles.productWrapper}>
        <TouchableOpacity
          style={styles.productCard}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.productName}>{item.name}</Text>

          <Text style={styles.productDetails}>
            Quantité :{" "}
            <Text style={styles.qty}>{item.quantity.toFixed(3)}</Text> | Prix
            achat : <Text style={styles.purchase}>{item.purchasePrice} Ar</Text>
          </Text>

          {item.salePrice ? (
            <Text style={styles.salePrice}>
              💰 Prix de vente :{" "}
              <Text style={styles.sale}>{item.salePrice} Ar</Text>
            </Text>
          ) : (
            <></>
          )}
        </TouchableOpacity>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setModalVisible(true)}
          >
            <Entypo name="edit" size={18} color={Colors.dark.text} />
          </TouchableOpacity>
          {/* Bouton supprimer */}
          <DeleteProductButton
            callback={() => setModalVisible(false)}
            item={item}
          />
        </View>
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <EditProductForm
            onCancel={() => setModalVisible(false)}
            product={item}
          />
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  productWrapper: {
    marginBottom: 10,
    backgroundColor: "#0F1535",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    shadowColor: "rgba(0,212,255,0.06)",
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  productCard: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  productDetails: {
    fontSize: 14,
    color: "#8891B3",
    marginTop: 4,
  },
  qty: {
    color: Colors.dark.info,
    fontWeight: "600",
  },
  purchase: {
    color: Colors.dark.danger,
    fontWeight: "600",
  },
  salePrice: {
    marginTop: 6,
    fontSize: 14,
    color: Colors.dark.success,
  },
  sale: {
    color: Colors.dark.success,
    fontWeight: "700",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 6,
    marginTop: 8,
  },
  editButton: {
    marginLeft: 4,
    padding: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    padding: 20,
  },
});

export default ProductListItem;
