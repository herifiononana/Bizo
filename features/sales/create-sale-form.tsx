import { Sale } from "@/interface/sale/sale";
import { useProductsStore } from "@/stores/product.store";
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
import { z } from "zod";

interface CreateSaleProps {
  onAddSale: (sales: Sale[]) => void;
  onCancel: () => void;
}

type CartDraft = { productId: string; quantity: number; salePrice: number };

type ItemForm = { productId: string; quantity: string; salePrice: string; totalPrice: string };

const EMPTY_ITEM: ItemForm = { productId: "", quantity: "", salePrice: "", totalPrice: "" };

const itemSchema = z.object({
  productId: z.string().min(1, "Veuillez choisir un produit"),
  quantity: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Quantité invalide"),
  salePrice: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Prix invalide"),
});

const CreateSaleForm: React.FC<CreateSaleProps> = ({ onAddSale, onCancel }) => {
  const { products } = useProductsStore((state) => state);
  const [cartDrafts, setCartDrafts] = useState<CartDraft[]>([]);
  const [formData, setFormData] = useState<ItemForm>(EMPTY_ITEM);
  const [isCredit, setIsCredit] = useState(false);
  const [clientName, setClientName] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [search, setSearch] = useState("");

  const selectedProduct = products?.find((p) => p.id === formData.productId);

  useEffect(() => {
    if (selectedProduct) {
      setFormData((prev) => ({
        ...prev,
        salePrice: String(selectedProduct.salePrice ?? ""),
      }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProduct?.id]);

  const totalDisplay =
    formData.quantity && formData.salePrice
      ? `${formData.quantity} × ${formData.salePrice} Ar`
      : "";

  const cartTotal = cartDrafts.reduce((sum, d) => sum + d.quantity * d.salePrice, 0);
  const currentItemTotal =
    formData.quantity && formData.salePrice
      ? Number(formData.quantity) * Number(formData.salePrice)
      : 0;
  const grandTotal = cartTotal + currentItemTotal;
  const totalItemCount = cartDrafts.length + (formData.productId ? 1 : 0);

  const validateCurrentItem = (): boolean => {
    const result = itemSchema.safeParse(formData);
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.errors.forEach((e) => {
        if (e.path[0]) errs[String(e.path[0])] = e.message;
      });
      setErrors(errs);
      return false;
    }
    if (!selectedProduct) {
      setErrors({ productId: "Produit introuvable" });
      return false;
    }
    const qty = Number(formData.quantity);
    const cartedQty = cartDrafts
      .filter((d) => d.productId === formData.productId)
      .reduce((sum, d) => sum + d.quantity, 0);
    if (qty + cartedQty > selectedProduct.quantity) {
      setErrors({ quantity: "Quantité totale supérieure au stock disponible" });
      return false;
    }
    setErrors({});
    return true;
  };

  const handleAddToCart = () => {
    if (!validateCurrentItem()) return;
    setCartDrafts([
      ...cartDrafts,
      {
        productId: formData.productId,
        quantity: Number(formData.quantity),
        salePrice: Number(formData.salePrice),
      },
    ]);
    setFormData(EMPTY_ITEM);
    setSearch("");
  };

  const handleRemoveFromCart = (index: number) => {
    setCartDrafts(cartDrafts.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    const allDrafts = [...cartDrafts];

    if (formData.productId) {
      if (!validateCurrentItem()) return;
      allDrafts.push({
        productId: formData.productId,
        quantity: Number(formData.quantity),
        salePrice: Number(formData.salePrice),
      });
    } else if (allDrafts.length === 0) {
      setErrors({ productId: "Veuillez choisir un produit" });
      return;
    }

    if (isCredit && !clientName.trim()) {
      setErrors({ clientName: "Nom du client requis pour une vente à crédit" });
      return;
    }

    const now = Date.now();
    const saleDate = new Date().toISOString();
    const groupId = allDrafts.length > 1 ? now.toString() : undefined;

    const sales: Sale[] = allDrafts.map((draft, i) => ({
      id: `${now}_${i}`,
      productId: draft.productId,
      quantity: draft.quantity,
      salePrice: draft.salePrice,
      totalAmount: draft.quantity * draft.salePrice,
      saleDate,
      isCredit,
      clientName: isCredit ? clientName : "",
      groupId,
    }));

    onAddSale(sales);
    Alert.alert("✅ Succès", "Vente réalisée avec succès !");
    setCartDrafts([]);
    setFormData(EMPTY_ITEM);
    setIsCredit(false);
    setClientName("");
    setErrors({});
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, justifyContent: "flex-end" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.sheet}>
        <View style={styles.handle} />

        <View style={styles.sheetHeader}>
          <View style={styles.sheetIconWrap}>
            <MaterialIcons name="point-of-sale" size={18} color="#FB923C" />
          </View>
          <Text style={styles.sheetTitle}>Nouvelle vente</Text>
          <TouchableOpacity style={styles.closeBtn} onPress={onCancel}>
            <MaterialIcons name="close" size={20} color="#B7BFD8" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Cart */}
          {cartDrafts.length > 0 && (
            <View style={styles.cartSection}>
              <Text style={styles.cartTitle}>
                Panier · {cartDrafts.length} article{cartDrafts.length > 1 ? "s" : ""}
              </Text>
              {cartDrafts.map((draft, i) => {
                const prod = products?.find((p) => p.id === draft.productId);
                return (
                  <View key={i} style={styles.cartItem}>
                    <View style={styles.cartItemInfo}>
                      <Text style={styles.cartItemName} numberOfLines={1}>
                        {prod?.name}
                      </Text>
                      <Text style={styles.cartItemSub}>
                        Qté {draft.quantity} × {draft.salePrice.toLocaleString()} Ar
                      </Text>
                    </View>
                    <Text style={styles.cartItemTotal}>
                      {(draft.quantity * draft.salePrice).toLocaleString()} Ar
                    </Text>
                    <TouchableOpacity
                      style={styles.removeBtn}
                      onPress={() => handleRemoveFromCart(i)}
                    >
                      <MaterialIcons name="close" size={16} color="#F43F5E" />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          )}

          {/* Product selector */}
          <Text style={styles.label}>
            {cartDrafts.length > 0 ? "Ajouter un produit" : "Produit"}
          </Text>
          {selectedProduct ? (
            <View style={styles.selectedBox}>
              <View style={styles.selectedInfo}>
                <Text style={styles.selectedName}>{selectedProduct.name}</Text>
                <Text style={styles.selectedSub}>
                  Stock {selectedProduct.quantity} · Prix{" "}
                  {selectedProduct.salePrice?.toLocaleString()} Ar
                </Text>
              </View>
              <TouchableOpacity
                style={styles.changeBtn}
                onPress={() => {
                  setFormData(EMPTY_ITEM);
                  setSearch("");
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
                  data={(products ?? []).filter((p) =>
                    p?.name?.toLowerCase().includes(search.toLowerCase())
                  )}
                  initialNumToRender={5}
                  maxToRenderPerBatch={5}
                  windowSize={5}
                  keyExtractor={(item) => item.id}
                  style={styles.dropdown}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() => {
                        setFormData({ ...formData, productId: item.id });
                        setSearch("");
                      }}
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

          {/* Quantité + Prix */}
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

          {/* Total auto-calc */}
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

          {/* Add to cart — visible only when product selected */}
          {selectedProduct && (
            <TouchableOpacity style={styles.addToCartBtn} onPress={handleAddToCart}>
              <MaterialIcons name="add-shopping-cart" size={16} color="#2ECC71" />
              <Text style={styles.addToCartBtnText}>Ajouter un autre produit</Text>
            </TouchableOpacity>
          )}

          {/* Grand total — visible when cart has items */}
          {cartDrafts.length > 0 && grandTotal > 0 && (
            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalLabel}>Total général</Text>
              <Text style={styles.grandTotalValue}>
                {grandTotal.toLocaleString()} Ar
              </Text>
            </View>
          )}

          {/* Vente à crédit */}
          <View style={styles.creditRow}>
            <View>
              <Text style={styles.creditLabel}>Vente à crédit</Text>
              <Text style={styles.creditSub}>Le paiement sera reporté</Text>
            </View>
            <Switch
              value={isCredit}
              onValueChange={setIsCredit}
              thumbColor={isCredit ? "#2ECC71" : "#545C7A"}
              trackColor={{ false: "#1B2342", true: "rgba(46,204,113,0.35)" }}
            />
          </View>

          {isCredit && (
            <>
              <Text style={styles.label}>Nom du client</Text>
              <TextInput
                placeholder="Ex: Tamby"
                placeholderTextColor="#545C7A"
                style={[styles.input, errors.clientName && styles.errorInput]}
                value={clientName}
                onChangeText={setClientName}
              />
              {errors.clientName && (
                <Text style={styles.errorText}>{errors.clientName}</Text>
              )}
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
              <Text style={styles.saveBtnText}>
                {totalItemCount > 1
                  ? `Enregistrer (${totalItemCount})`
                  : "Enregistrer"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default CreateSaleForm;

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
  cartSection: {
    backgroundColor: "rgba(46,204,113,0.06)",
    borderWidth: 1,
    borderColor: "rgba(46,204,113,0.2)",
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  cartTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#2ECC71",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cartItemInfo: {
    flex: 1,
  },
  cartItemName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#F4F6FF",
  },
  cartItemSub: {
    fontSize: 12,
    color: "#7A83A2",
    marginTop: 1,
  },
  cartItemTotal: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2ECC71",
  },
  removeBtn: {
    padding: 4,
    borderRadius: 6,
    backgroundColor: "rgba(244,63,94,0.1)",
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
  addToCartBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "rgba(46,204,113,0.08)",
    borderWidth: 1,
    borderColor: "rgba(46,204,113,0.25)",
    borderRadius: 14,
    height: 44,
    marginBottom: 14,
  },
  addToCartBtnText: {
    color: "#2ECC71",
    fontWeight: "700",
    fontSize: 14,
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(249,115,22,0.08)",
    borderWidth: 1,
    borderColor: "rgba(249,115,22,0.2)",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
  },
  grandTotalLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#B7BFD8",
  },
  grandTotalValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FB923C",
    letterSpacing: -0.5,
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
