import { Sale } from "@/interface/sale/sale";
import { useProductsStore } from "@/stores/product.store";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
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

interface UpdateSaleGroupFormProps {
  groupItems: Sale[];
  onUpdateGroup: (newSales: Sale[]) => void;
  onCancel: () => void;
}

type EditableCartDraft = {
  productId: string;
  quantity: string;
  salePrice: string;
};

type NewItemForm = {
  productId: string;
  quantity: string;
  salePrice: string;
};

const EMPTY_NEW_ITEM: NewItemForm = { productId: "", quantity: "", salePrice: "" };

const newItemSchema = z.object({
  quantity: z
    .string()
    .refine((v) => !isNaN(Number(v)) && Number(v) > 0, "Quantité invalide"),
  salePrice: z
    .string()
    .refine((v) => !isNaN(Number(v)) && Number(v) > 0, "Prix invalide"),
});

const UpdateSaleGroupForm: React.FC<UpdateSaleGroupFormProps> = ({
  groupItems,
  onUpdateGroup,
  onCancel,
}) => {
  const { products } = useProductsStore((state) => state);

  const [cartDrafts, setCartDrafts] = useState<EditableCartDraft[]>(() =>
    groupItems.map((s) => ({
      productId: s.productId,
      quantity: String(s.quantity),
      salePrice: String(s.salePrice),
    }))
  );

  const [isCredit, setIsCredit] = useState(groupItems[0]?.isCredit ?? false);
  const [clientName, setClientName] = useState(groupItems[0]?.clientName ?? "");
  const [newItemForm, setNewItemForm] = useState<NewItemForm>(EMPTY_NEW_ITEM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [search, setSearch] = useState("");
  const [showAddProduct, setShowAddProduct] = useState(false);

  // Available stock = current product stock + original qty (which will be returned on save)
  const originalQtyByProduct = useMemo(() => {
    const map = new Map<string, number>();
    for (const s of groupItems) {
      map.set(s.productId, (map.get(s.productId) ?? 0) + s.quantity);
    }
    return map;
  }, [groupItems]);

  const availableStock = (productId: string): number => {
    const product = products?.find((p) => p.id === productId);
    if (!product) return 0;
    return product.quantity + (originalQtyByProduct.get(productId) ?? 0);
  };

  const selectedNewProduct = products?.find((p) => p.id === newItemForm.productId);

  const grandTotal = cartDrafts.reduce((sum, d) => {
    const qty = Number(d.quantity);
    const price = Number(d.salePrice);
    return sum + (isNaN(qty) || isNaN(price) ? 0 : qty * price);
  }, 0);

  const updateCartItem = (
    index: number,
    field: keyof EditableCartDraft,
    value: string
  ) => {
    setCartDrafts((prev) =>
      prev.map((d, i) => (i === index ? { ...d, [field]: value } : d))
    );
    setErrors((prev) => {
      const next = { ...prev };
      delete next[`cart_${field}_${index}`];
      return next;
    });
  };

  const removeCartItem = (index: number) => {
    setCartDrafts((prev) => prev.filter((_, i) => i !== index));
  };

  const validateCartItems = (): boolean => {
    const newErrors: Record<string, string> = {};
    for (let i = 0; i < cartDrafts.length; i++) {
      const d = cartDrafts[i];
      const qty = Number(d.quantity);
      const price = Number(d.salePrice);
      if (isNaN(qty) || qty <= 0) {
        newErrors[`cart_quantity_${i}`] = "Quantité invalide";
      }
      if (isNaN(price) || price <= 0) {
        newErrors[`cart_salePrice_${i}`] = "Prix invalide";
      }
      if (!newErrors[`cart_quantity_${i}`]) {
        const totalQtyForProduct = cartDrafts.reduce(
          (sum, c) =>
            c.productId === d.productId ? sum + Number(c.quantity) : sum,
          0
        );
        if (totalQtyForProduct > availableStock(d.productId)) {
          newErrors[`cart_quantity_${i}`] = `Stock dispo: ${availableStock(d.productId)}`;
        }
      }
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }
    return true;
  };

  const handleAddNewItemToCart = () => {
    if (!newItemForm.productId) {
      setErrors({ newItem_productId: "Veuillez choisir un produit" });
      return;
    }
    const result = newItemSchema.safeParse(newItemForm);
    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.errors.forEach((e) => {
        if (e.path[0]) errs[`newItem_${e.path[0]}`] = e.message;
      });
      setErrors(errs);
      return;
    }
    const qty = Number(newItemForm.quantity);
    const alreadyCartedQty = cartDrafts
      .filter((d) => d.productId === newItemForm.productId)
      .reduce((sum, d) => sum + Number(d.quantity), 0);
    if (qty + alreadyCartedQty > availableStock(newItemForm.productId)) {
      setErrors({
        newItem_quantity: `Stock dispo: ${availableStock(newItemForm.productId)}`,
      });
      return;
    }
    setCartDrafts((prev) => [
      ...prev,
      {
        productId: newItemForm.productId,
        quantity: newItemForm.quantity,
        salePrice: newItemForm.salePrice,
      },
    ]);
    setNewItemForm(EMPTY_NEW_ITEM);
    setSearch("");
    setShowAddProduct(false);
    setErrors({});
  };

  const handleSubmit = () => {
    setErrors({});
    if (cartDrafts.length === 0) {
      setErrors({ general: "Au moins un produit requis" });
      return;
    }
    if (!validateCartItems()) return;
    if (isCredit && !clientName.trim()) {
      setErrors({ clientName: "Nom du client requis pour une vente à crédit" });
      return;
    }

    const now = Date.now();
    const originalGroupId = groupItems[0]?.groupId;
    const saleDate = groupItems[0]?.saleDate ?? new Date().toISOString();
    const newGroupId = cartDrafts.length > 1 ? originalGroupId : undefined;

    const newSales: Sale[] = cartDrafts.map((draft, i) => {
      // Preserve original Sale id when same position + same product (stable identity)
      const originalSale =
        i < groupItems.length && groupItems[i].productId === draft.productId
          ? groupItems[i]
          : undefined;
      return {
        id: originalSale?.id ?? `${now}_edit_${i}`,
        productId: draft.productId,
        quantity: Number(draft.quantity),
        salePrice: Number(draft.salePrice),
        totalAmount: Number(draft.quantity) * Number(draft.salePrice),
        saleDate,
        isCredit,
        clientName: isCredit ? clientName.trim() : "",
        groupId: newGroupId,
        updatedAt: new Date().toISOString(),
      };
    });

    onUpdateGroup(newSales);
  };

  const newItemCartedQty = cartDrafts
    .filter((d) => d.productId === newItemForm.productId)
    .reduce((sum, d) => sum + Number(d.quantity), 0);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, justifyContent: "flex-end" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.sheet}>
        <View style={styles.handle} />

        <View style={styles.sheetHeader}>
          <View style={styles.sheetIconWrap}>
            <MaterialIcons name="edit" size={18} color="#A78BFA" />
          </View>
          <Text style={styles.sheetTitle}>Modifier la vente</Text>
          <TouchableOpacity style={styles.closeBtn} onPress={onCancel}>
            <MaterialIcons name="close" size={20} color="#B7BFD8" />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Editable cart */}
          <Text style={styles.sectionLabel}>
            Produits · {cartDrafts.length}
          </Text>

          {cartDrafts.map((draft, i) => {
            const product = products?.find((p) => p.id === draft.productId);
            const qty = Number(draft.quantity);
            const price = Number(draft.salePrice);
            const itemTotal = !isNaN(qty) && !isNaN(price) ? qty * price : 0;
            return (
              <View key={i} style={styles.editableItem}>
                <Text style={styles.editableItemName} numberOfLines={1}>
                  {product?.name ?? "Produit inconnu"}
                </Text>
                <View style={styles.editableItemRow}>
                  <View style={styles.editableField}>
                    <Text style={styles.editableFieldLabel}>Qté</Text>
                    <TextInput
                      style={[
                        styles.smallInput,
                        errors[`cart_quantity_${i}`] && styles.errorInput,
                      ]}
                      keyboardType="numeric"
                      value={draft.quantity}
                      onChangeText={(v) => updateCartItem(i, "quantity", v)}
                    />
                  </View>
                  <View style={styles.editableField}>
                    <Text style={styles.editableFieldLabel}>Prix (Ar)</Text>
                    <TextInput
                      style={[
                        styles.smallInput,
                        errors[`cart_salePrice_${i}`] && styles.errorInput,
                      ]}
                      keyboardType="numeric"
                      value={draft.salePrice}
                      onChangeText={(v) => updateCartItem(i, "salePrice", v)}
                    />
                  </View>
                  <View style={styles.editableTotalCol}>
                    <Text style={styles.editableFieldLabel}>Total</Text>
                    <Text style={styles.editableTotalValue}>
                      {itemTotal > 0 ? itemTotal.toLocaleString() : "—"}
                    </Text>
                  </View>
                  {cartDrafts.length > 1 && (
                    <TouchableOpacity
                      style={styles.removeBtn}
                      onPress={() => removeCartItem(i)}
                    >
                      <MaterialIcons name="close" size={16} color="#F43F5E" />
                    </TouchableOpacity>
                  )}
                </View>
                {errors[`cart_quantity_${i}`] && (
                  <Text style={styles.errorText}>{errors[`cart_quantity_${i}`]}</Text>
                )}
                {errors[`cart_salePrice_${i}`] && (
                  <Text style={styles.errorText}>{errors[`cart_salePrice_${i}`]}</Text>
                )}
              </View>
            );
          })}

          {errors.general && (
            <Text style={[styles.errorText, { marginBottom: 8 }]}>
              {errors.general}
            </Text>
          )}

          {/* Grand total */}
          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>Total général</Text>
            <Text style={styles.grandTotalValue}>
              {grandTotal.toLocaleString()} Ar
            </Text>
          </View>

          {/* Add product section */}
          {!showAddProduct ? (
            <TouchableOpacity
              style={styles.addProductBtn}
              onPress={() => setShowAddProduct(true)}
            >
              <MaterialIcons name="add-shopping-cart" size={16} color="#A78BFA" />
              <Text style={styles.addProductBtnText}>Ajouter un produit</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.addSection}>
              <View style={styles.addSectionHeader}>
                <Text style={styles.sectionLabel}>Nouveau produit</Text>
                <TouchableOpacity
                  onPress={() => {
                    setShowAddProduct(false);
                    setNewItemForm(EMPTY_NEW_ITEM);
                    setSearch("");
                    setErrors((prev) => {
                      const next = { ...prev };
                      Object.keys(next).forEach((k) => {
                        if (k.startsWith("newItem_")) delete next[k];
                      });
                      return next;
                    });
                  }}
                >
                  <MaterialIcons name="close" size={18} color="#7A83A2" />
                </TouchableOpacity>
              </View>

              {selectedNewProduct ? (
                <View style={styles.selectedBox}>
                  <View style={styles.selectedInfo}>
                    <Text style={styles.selectedName}>
                      {selectedNewProduct.name}
                    </Text>
                    <Text style={styles.selectedSub}>
                      Dispo {availableStock(selectedNewProduct.id) - newItemCartedQty} ·{" "}
                      {selectedNewProduct.salePrice?.toLocaleString()} Ar
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.changeBtn}
                    onPress={() => setNewItemForm(EMPTY_NEW_ITEM)}
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
                    style={[
                      styles.input,
                      errors.newItem_productId && styles.errorInput,
                    ]}
                    value={search}
                    onChangeText={setSearch}
                  />
                  {errors.newItem_productId && (
                    <Text style={styles.errorText}>{errors.newItem_productId}</Text>
                  )}
                  {search.length > 0 && (
                    <FlatList
                      data={(products ?? []).filter((p) =>
                        p?.name?.toLowerCase().includes(search.toLowerCase())
                      )}
                      initialNumToRender={5}
                      maxToRenderPerBatch={5}
                      windowSize={3}
                      keyExtractor={(item) => item.id}
                      style={styles.dropdown}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={styles.dropdownItem}
                          onPress={() => {
                            setNewItemForm({
                              productId: item.id,
                              quantity: "",
                              salePrice: String(item.salePrice ?? ""),
                            });
                            setSearch("");
                          }}
                        >
                          <Text style={styles.dropdownText}>
                            {item.name} ({availableStock(item.id)} dispo)
                          </Text>
                        </TouchableOpacity>
                      )}
                    />
                  )}
                </View>
              )}

              {selectedNewProduct && (
                <>
                  <View style={styles.row2col}>
                    <View style={styles.col2}>
                      <Text style={styles.label}>Quantité</Text>
                      <TextInput
                        placeholder="Ex: 2"
                        placeholderTextColor="#545C7A"
                        style={[
                          styles.input,
                          errors.newItem_quantity && styles.errorInput,
                        ]}
                        keyboardType="numeric"
                        value={newItemForm.quantity}
                        onChangeText={(v) =>
                          setNewItemForm({ ...newItemForm, quantity: v })
                        }
                      />
                      {errors.newItem_quantity && (
                        <Text style={styles.errorText}>
                          {errors.newItem_quantity}
                        </Text>
                      )}
                    </View>
                    <View style={styles.col2}>
                      <Text style={styles.label}>Prix (Ar)</Text>
                      <TextInput
                        placeholder="Ex: 2500"
                        placeholderTextColor="#545C7A"
                        style={[
                          styles.input,
                          errors.newItem_salePrice && styles.errorInput,
                        ]}
                        keyboardType="numeric"
                        value={newItemForm.salePrice}
                        onChangeText={(v) =>
                          setNewItemForm({ ...newItemForm, salePrice: v })
                        }
                      />
                      {errors.newItem_salePrice && (
                        <Text style={styles.errorText}>
                          {errors.newItem_salePrice}
                        </Text>
                      )}
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.confirmAddBtn}
                    onPress={handleAddNewItemToCart}
                  >
                    <MaterialIcons name="add" size={18} color="#fff" />
                    <Text style={styles.confirmAddBtnText}>Ajouter au panier</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}

          {/* Credit / client */}
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

export default UpdateSaleGroupForm;

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
    backgroundColor: "rgba(167,139,250,0.14)",
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
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#A78BFA",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  editableItem: {
    backgroundColor: "rgba(167,139,250,0.06)",
    borderWidth: 1,
    borderColor: "rgba(167,139,250,0.15)",
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
  },
  editableItemName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#F4F6FF",
    marginBottom: 10,
  },
  editableItemRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  editableField: {
    flex: 1,
  },
  editableFieldLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#7A83A2",
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  smallInput: {
    backgroundColor: "#1B2342",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    borderRadius: 10,
    height: 40,
    paddingHorizontal: 10,
    color: "#F4F6FF",
    fontSize: 14,
    fontWeight: "600",
  },
  editableTotalCol: {
    flex: 1,
    alignItems: "flex-end",
  },
  editableTotalValue: {
    fontSize: 14,
    fontWeight: "800",
    color: "#2ECC71",
    marginTop: 4,
  },
  removeBtn: {
    marginTop: 8,
    padding: 4,
    borderRadius: 8,
    backgroundColor: "rgba(244,63,94,0.1)",
    alignSelf: "flex-start",
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
    marginTop: 4,
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
  addProductBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "rgba(167,139,250,0.08)",
    borderWidth: 1,
    borderColor: "rgba(167,139,250,0.25)",
    borderRadius: 14,
    height: 44,
    marginBottom: 14,
  },
  addProductBtnText: {
    color: "#A78BFA",
    fontWeight: "700",
    fontSize: 14,
  },
  addSection: {
    backgroundColor: "rgba(167,139,250,0.04)",
    borderWidth: 1,
    borderColor: "rgba(167,139,250,0.15)",
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
  },
  addSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  confirmAddBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#A78BFA",
    borderRadius: 14,
    height: 44,
    marginTop: 4,
    shadowColor: "rgba(167,139,250,0.45)",
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmAddBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
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
    marginTop: -4,
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
    backgroundColor: "#A78BFA",
    borderRadius: 14,
    height: 50,
    gap: 8,
    shadowColor: "rgba(167,139,250,0.45)",
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
