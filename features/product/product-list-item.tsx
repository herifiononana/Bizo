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
    backgroundColor: Colors.dark.surface, // surface sombre
    borderRadius: 8,
    padding: 10,
  },
  productCard: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    color: Colors.dark.text, // texte principal
    fontWeight: "600",
  },
  productDetails: {
    fontSize: 15,
    color: Colors.dark.icon, // texte secondaire
    marginTop: 4,
  },
  qty: {
    color: Colors.dark.info, // bleu
    fontWeight: "600",
  },
  purchase: {
    color: Colors.dark.danger, // rouge
    fontWeight: "600",
  },
  salePrice: {
    marginTop: 6,
    fontSize: 15,
    color: Colors.dark.success, // vert
  },
  sale: {
    color: Colors.dark.success,
    fontWeight: "700",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 1,
  },
  editButton: {
    marginLeft: 8,
    padding: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.dark.text + "33",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)", // overlay plus visible en dark mode
    justifyContent: "center",
    padding: 20,
  },
});

export default ProductListItem;
