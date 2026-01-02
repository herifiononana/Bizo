import { Colors } from "@/constants/theme";
import { Product } from "@/interface/product/product";
import { Entypo } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import DeleteProductButton from "./delete-product-button";
import EditProductForm from "./edit-product-form";

function ProductListItem({ item }: { item: Product }) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <View style={styles.productWrapper}>
        <TouchableOpacity
          style={styles.productCard}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.8}
        >
          {/* Nom */}
          <Text style={styles.productName}>{item.name}</Text>

          {/* Stock & achat */}
          <Text style={styles.productDetails}>
            Stock : <Text style={styles.qty}>{item.quantity.toFixed(3)}</Text> |
            Achat :{" "}
            <Text style={styles.purchase}>
              {item?.purchasePrice?.toLocaleString()} Ar
            </Text>
          </Text>

          {/* Unités de vente */}
          {item.units && item.units.length > 0 && (
            <View style={styles.unitsRow}>
              {item.units.slice(0, 3).map((u) => (
                <View key={u.type} style={styles.unitBadge}>
                  <Text style={styles.unitText}>
                    {u.type} • {u.salePrice} Ar
                  </Text>
                </View>
              ))}
              {item.units.length > 3 && (
                <Text style={styles.moreUnits}>+{item.units.length - 3}</Text>
              )}
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setModalVisible(true)}
          >
            <Entypo name="edit" size={18} color={Colors.dark.text} />
          </TouchableOpacity>
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

export default ProductListItem;
const styles = StyleSheet.create({
  productWrapper: {
    display: "flex",
    marginBottom: 10,
    backgroundColor: Colors.dark.surface, // surface sombre
    borderRadius: 8,
    padding: 10,
  },
  productCard: {
    flex: 1,
    padding: 4,
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.dark.text,
  },
  productDetails: {
    fontSize: 14,
    color: Colors.dark.icon,
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
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  editButton: {
    marginLeft: 8,
    padding: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.dark.text + "33",
  },

  /* unités */
  unitsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 8,
  },
  unitBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: Colors.dark.border,
  },
  unitText: {
    fontSize: 12,
    color: Colors.dark.text,
    fontWeight: "600",
  },
  moreUnits: {
    fontSize: 12,
    color: Colors.dark.icon,
    alignSelf: "center",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    padding: 20,
  },
});
