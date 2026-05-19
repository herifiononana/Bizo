import { useFinance } from "@/hooks/finance/useFinance";
import { Sale } from "@/interface/sale/sale";
import { saveProducts } from "@/services/product";
import { saveSales, updateLocalSales } from "@/services/sale";
import { useProductsStore } from "@/stores/product.store";
import { useSalesStore } from "@/stores/sales.store";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { CreateSaleDTO, saleSchema } from "./create-sale.schema";

interface CreateSaleProps {
  sale: Sale;
  onCancel: () => void;
}

const UpdateSaleForm: React.FC<CreateSaleProps> = ({ sale, onCancel }) => {
  const { changeFinanceStatus } = useFinance();
  const { products, setProducts } = useProductsStore((state) => state);
  const { sales, setSales } = useSalesStore((state) => state);
  const [currentProductId, setCurrentProductId] = useState<string>(sale.productId);

  const selectedProduct =
    products && products.find((p) => p.id === currentProductId);

  const [formData, setFormData] = useState<CreateSaleDTO>({
    productId: sale.productId,
    quantity: sale.quantity.toString(),
    totalPrice: selectedProduct?.salePrice
      ? (sale.quantity * selectedProduct?.salePrice).toString()
      : "0",
    salePrice: sale.salePrice.toString(),
    isCredit: sale.isCredit,
    clientName: sale.clientName,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [search, setSearch] = useState<string>("");

  const handleSelectProduct = (id: string) => {
    setFormData({ ...formData, productId: id });
    setCurrentProductId(id);
    setSearch("");
  };

  const handleUpdateProductStock = (updatedSale: Sale) => {
    if (!products) return [];
    return products.map((product) => {
      if (
        product.id === sale.productId &&
        sale.productId !== updatedSale.productId
      ) {
        return { ...product, quantity: product.quantity + sale.quantity };
      }
      if (product.id === updatedSale.productId) {
        return {
          ...product,
          quantity:
            product.quantity -
            updatedSale.quantity +
            (product.id === sale.productId ? sale.quantity : 0),
        };
      }
      return product;
    });
  };

  const handleUpdateSale = async (updatedSale: Sale) => {
    if (!products || !sales) return;
    const updatedSales = [updatedSale, ...sales];
    setSales(updatedSales);
    const updatedProducts = handleUpdateProductStock(updatedSale);
    try {
      const data = await updateLocalSales(sales, updatedSale);
      await saveSales(data);
      setSales(data);
      await saveProducts(updatedProducts);
      setProducts(updatedProducts);
    } catch (e) {
      console.log("Erreur de sauvegarde :", e);
    }
    changeFinanceStatus();
  };

  const handleSubmit = () => {
    if (!products) return;
    const result = saleSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    if (!selectedProduct) {
      setErrors({ productId: "Produit introuvable" });
      return;
    }
    const quantitySold = Number(formData.quantity);
    if (quantitySold > selectedProduct.quantity) {
      setErrors({ quantity: "Quantité supérieure au stock disponible" });
      return;
    }
    const updatedSale: Sale = {
      id: sale.id,
      productId: currentProductId,
      quantity: quantitySold,
      salePrice: Number(formData.salePrice),
      totalAmount: quantitySold * Number(formData.salePrice),
      saleDate: new Date().toISOString(),
      isCredit: formData.isCredit,
      clientName: formData.isCredit ? formData.clientName : "",
    };
    handleUpdateSale(updatedSale);
    Alert.alert("✅ Succès", "Vente modifiée avec succès !");
    onCancel();
  };

  const filteredProducts = products
    ? products.filter((p) =>
        p?.name?.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  useEffect(() => {
    setFormData({
      ...formData,
      totalPrice: String(
        selectedProduct?.salePrice && formData.quantity
          ? String(selectedProduct.salePrice * Number(formData.quantity))
          : ""
      ),
      salePrice: String(selectedProduct?.salePrice ?? ""),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProduct, currentProductId]);

  const totalDisplay = formData.quantity && formData.salePrice
    ? `${formData.quantity} × ${formData.salePrice} Ar`
    : "";

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.sheet}>
        {/* Drag handle */}
        <View style={styles.handle} />

        {/* Header */}
        <View style={styles.sheetHeader}>
          <View style={styles.sheetIconWrap}>
            <MaterialIcons name="edit" size={18} color="#FB923C" />
          </View>
          <Text style={styles.sheetTitle}>Modifier la vente</Text>
          <TouchableOpacity style={styles.closeBtn} onPress={onCancel}>
            <MaterialIcons name="close" size={20} color="#B7BFD8" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Product selector */}
          <Text style={styles.label}>Produit</Text>
          {selectedProduct ? (
            <View style={styles.selectedBox}>
              <View style={styles.selectedInfo}>
                <Text style={styles.selectedName}>{selectedProduct.name}</Text>
                <Text style={styles.selectedSub}>
                  Stock {selectedProduct.quantity} · Prix {selectedProduct.salePrice?.toLocaleString()} Ar
                </Text>
              </View>
              <TouchableOpacity
                style={styles.changeBtn}
                onPress={() => {
                  setCurrentProductId("");
                  setFormData({ ...formData, totalPrice: "", productId: "" });
                }}
              >
                <MaterialIcons name="edit" size={14} color="#2ECC71" />
                <Text style={styles.changeBtnText}>Changer</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <TextInput
                placeholder="Rechercher un produit..."
                placeholderTextColor="#545C7A"
                style={[styles.input, errors.productId && styles.errorInput]}
                value={search}
                onChangeText={setSearch}
              />
              {errors.productId && (
                <Text style={styles.errorText}>{errors.productId}</Text>
              )}
              {search.length > 0 && (
                <FlatList
                  data={filteredProducts}
                  initialNumToRender={5}
                  maxToRenderPerBatch={5}
                  windowSize={5}
                  keyExtractor={(item) => item.id}
                  style={styles.dropdown}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() => handleSelectProduct(item.id)}
                    >
                      <Text style={styles.dropdownText}>
                        {item.name} ({item.quantity} en stock)
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              )}
            </View>
          )}

          {/* Quantité + Prix unitaire side by side */}
          <View style={styles.row2col}>
            <View style={styles.col2}>
              <Text style={styles.label}>Quantité</Text>
              <TextInput
                placeholder="Ex: 5"
                placeholderTextColor="#545C7A"
                style={[styles.input, errors.quantity && styles.errorInput]}
                keyboardType="numeric"
                value={formData.quantity}
                onChangeText={(text) => {
                  const total = selectedProduct?.salePrice
                    ? Number(text) * selectedProduct.salePrice
                    : 0;
                  setFormData({
                    ...formData,
                    quantity: text,
                    totalPrice: total ? total.toFixed(2) : "",
                  });
                }}
              />
              {errors.quantity && (
                <Text style={styles.errorText}>{errors.quantity}</Text>
              )}
            </View>
            <View style={styles.col2}>
              <Text style={styles.label}>Prix unitaire (Ar)</Text>
              <TextInput
                placeholder="Ex: 2500"
                placeholderTextColor="#545C7A"
                style={[styles.input, errors.salePrice && styles.errorInput]}
                keyboardType="numeric"
                value={formData.salePrice}
                onChangeText={(text) =>
                  setFormData({ ...formData, salePrice: text })
                }
              />
              {errors.salePrice && (
                <Text style={styles.errorText}>{errors.salePrice}</Text>
              )}
            </View>
          </View>

          {/* Total — saisir le total calcule automatiquement la quantite */}
          <Text style={styles.label}>
            {"Total (Ar)"}
            {totalDisplay ? (
              <Text style={styles.totalFormulaInline}>{" · " + totalDisplay}</Text>
            ) : null}
          </Text>
          <TextInput
            placeholder="Ex: 500 → quantité auto"
            placeholderTextColor="#545C7A"
            style={[styles.input, styles.totalInput]}
            keyboardType="numeric"
            value={formData.totalPrice}
            onChangeText={(text) => {
              const qty =
                formData.salePrice && Number(formData.salePrice) > 0
                  ? String(Number(text) / Number(formData.salePrice))
                  : formData.quantity;
              setFormData({ ...formData, totalPrice: text, quantity: qty });
            }}
          />

          {/* Vente à crédit */}
          <View style={styles.creditRow}>
            <View>
              <Text style={styles.creditLabel}>Vente à crédit</Text>
              <Text style={styles.creditSub}>Le paiement sera reporté</Text>
            </View>
            <Switch
              value={formData.isCredit}
              onValueChange={(value) =>
                setFormData({ ...formData, isCredit: value })
              }
              thumbColor={formData.isCredit ? "#2ECC71" : "#545C7A"}
              trackColor={{ false: "#1B2342", true: "rgba(46,204,113,0.35)" }}
            />
          </View>

          {formData.isCredit && (
            <>
              <Text style={styles.label}>Nom du client</Text>
              <TextInput
                placeholder="Ex: Tamby"
                placeholderTextColor="#545C7A"
                style={[styles.input, errors.clientName && styles.errorInput]}
                value={formData.clientName}
                onChangeText={(text) =>
                  setFormData({ ...formData, clientName: text })
                }
              />
            </>
          )}

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
              <MaterialIcons name="close" size={18} color="#B7BFD8" />
              <Text style={styles.cancelBtnText}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSubmit}>
              <MaterialIcons name="save" size={18} color="#fff" />
              <Text style={styles.saveBtnText}>Enregistrer</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default UpdateSaleForm;

const styles = StyleSheet.create({
  sheet: {
    backgroundColor: "#141B33",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    maxHeight: "95%",
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 10,
  },
  sheetIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(249,115,22,0.14)",
    alignItems: "center",
    justifyContent: "center",
  },
  sheetTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "800",
    color: "#F4F6FF",
    letterSpacing: -0.4,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  label: {
    fontWeight: "700",
    marginBottom: 6,
    color: "#B7BFD8",
    fontSize: 13,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 50,
    marginBottom: 12,
    backgroundColor: "#1B2342",
    color: "#F4F6FF",
    fontSize: 15,
  },
  errorInput: {
    borderColor: "#F43F5E",
    backgroundColor: "rgba(244,63,94,0.06)",
  },
  errorText: {
    color: "#F43F5E",
    fontSize: 12,
    marginBottom: 6,
    marginTop: -8,
  },
  selectedBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(46,204,113,0.08)",
    borderColor: "rgba(46,204,113,0.28)",
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
  },
  selectedInfo: {
    flex: 1,
  },
  selectedName: {
    color: "#F4F6FF",
    fontWeight: "700",
    fontSize: 15,
    marginBottom: 2,
  },
  selectedSub: {
    color: "#7A83A2",
    fontSize: 12,
    fontWeight: "500",
  },
  changeBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(46,204,113,0.12)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  changeBtnText: {
    color: "#2ECC71",
    fontWeight: "700",
    fontSize: 13,
  },
  dropdown: {
    backgroundColor: "#1B2342",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    borderRadius: 14,
    maxHeight: 160,
    marginTop: -4,
    marginBottom: 12,
  },
  dropdownItem: {
    padding: 13,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.04)",
  },
  dropdownText: {
    fontSize: 15,
    color: "#F4F6FF",
  },
  row2col: {
    flexDirection: "row",
    gap: 10,
  },
  col2: {
    flex: 1,
  },
  totalInput: {
    borderColor: "rgba(46,204,113,0.35)",
    backgroundColor: "rgba(46,204,113,0.06)",
    color: "#2ECC71",
  },
  totalFormulaInline: {
    fontSize: 12,
    color: "#545C7A",
    fontWeight: "500",
    textTransform: "none",
    letterSpacing: 0,
  },
  creditRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1B2342",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  creditLabel: {
    fontSize: 15,
    color: "#F4F6FF",
    fontWeight: "700",
  },
  creditSub: {
    fontSize: 12,
    color: "#7A83A2",
    marginTop: 2,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  cancelBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 14,
    height: 50,
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  cancelBtnText: {
    color: "#B7BFD8",
    fontWeight: "700",
    fontSize: 15,
  },
  saveBtn: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F97316",
    borderRadius: 14,
    height: 50,
    gap: 8,
    shadowColor: "rgba(249,115,22,0.45)",
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 6,
  },
  saveBtnText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 15,
  },
});
