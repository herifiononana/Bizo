import { Picker } from "@react-native-picker/picker";
import React, { useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { CancelButton } from "@/components/cancel-button";
import { SaveButton } from "@/components/save-button";
import { Colors } from "@/constants/theme";
import { Order } from "@/interface/order";
import { OrderDTO, OrderSchema } from "@/interface/order/schema";
import { convertDtoToOrder } from "@/services/order";
import { useClientsStore } from "@/stores/client.store";
import { useProductsStore } from "@/stores/product.store";

/* =======================
 * Types
 * ======================= */

type OrderLineForm = {
  productId: string;
  unit: string;
  quantity: string;
};

type StockError = {
  productId: string;
  error: string;
};

type ComputedOrder = {
  items: any[];
  total: string;
  errors: StockError[];
};

interface CreateOrderFormProps {
  onSubmit: (order: Order) => void;
  onCancel: () => void;
}

/* =======================
 * Component
 * ======================= */

const CreateOrderForm = ({ onSubmit, onCancel }: CreateOrderFormProps) => {
  const { products } = useProductsStore();
  const { clients } = useClientsStore();

  const [clientSearch, setClientSearch] = useState("");
  const [productSearch, setProductSearch] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<{
    clientId: string;
    clientName: string;
    order: OrderLineForm[];
  }>({
    clientId: "",
    clientName: "",
    order: [],
  });

  /* =======================
   * Filters
   * ======================= */

  const filteredClients = clients?.filter((c) =>
    c.name.toLowerCase().includes(clientSearch.toLowerCase())
  );

  const filteredProducts = products?.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  /* =======================
   * Order helpers
   * ======================= */
  const addProductToOrder = (productId: string) => {
    const product = products?.find((p) => p.id === productId);
    if (!product || !product.units || product.units.length === 0) return;

    setFormData((prev) => ({
      ...prev,
      order: [
        {
          productId,
          unit: product.units[0].type,
          quantity: "1",
        },
        ...prev.order,
      ],
    }));

    setProductSearch("");
  };

  const updateOrderLine = (
    index: number,
    field: keyof OrderLineForm,
    value: string
  ) => {
    setFormData((prev) => {
      const order = [...prev.order];
      order[index] = { ...order[index], [field]: value };
      return { ...prev, order };
    });
  };

  const removeOrderLine = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      order: prev.order.filter((_, i) => i !== index),
    }));
  };

  /* =======================
   * Business computation
   * ======================= */

  const computedOrder: ComputedOrder | null = useMemo(() => {
    if (!products) return null;

    let total = 0;
    const errors: StockError[] = [];

    const items = formData.order
      .map((line) => {
        const product = products.find((p) => p.id === line.productId);
        if (!product) return null;

        const unit = product.units?.find((u) => u.type === line.unit);
        if (!unit) return null;

        const quantity = Number(line.quantity);
        const stockImpact = quantity * unit.conversion;

        if (stockImpact > product.quantity) {
          errors.push({
            productId: product.id,
            error: `Stock insuffisant pour ${product.name}`,
          });
          return null;
        }

        const subTotal = quantity * unit.salePrice;
        total += subTotal;

        return {
          productId: product.id,
          productName: product.name,
          unit: line.unit,
          quantity: line.quantity,
          unitPrice: String(unit.salePrice),
          stockImpact: String(stockImpact),
          subTotal: String(subTotal),
        };
      })
      .filter(Boolean);

    return {
      items,
      total: total.toFixed(2),
      errors,
    };
  }, [formData.order, products]);

  const getStockError = (productId: string) =>
    computedOrder?.errors.find((e) => e.productId === productId);

  /* =======================
   * Submit
   * ======================= */

  const handleSubmit = () => {
    if (!computedOrder) return;

    const payload: OrderDTO = {
      clientId: formData.clientId,
      clientName: formData.clientName,
      order: computedOrder.items,
      total: computedOrder.total,
    };

    const result = OrderSchema.safeParse(payload);

    if (!result.success) {
      const errs: Record<string, string> = {};
      result.error.errors.forEach((e) => {
        errs[String(e.path[0])] = e.message;
      });
      setErrors(errs);
      return;
    }

    const newOrder: Order = convertDtoToOrder(result.data);

    onSubmit(newOrder);
    Alert.alert("✅ Succès", "Commande enregistrée");
  };

  /* =======================
   * UI
   * ======================= */

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <Text style={styles.title}>🧾 Nouvelle commande</Text>

      {/* CLIENT */}
      <Text style={styles.label}>Client</Text>

      {formData.clientId ? (
        <View style={styles.selectedBox}>
          <Text style={styles.selectedText}>{formData.clientName}</Text>
          <TouchableOpacity
            onPress={() =>
              setFormData({ ...formData, clientId: "", clientName: "" })
            }
          >
            <Text style={styles.clearText}>Changer ✏️</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <TextInput
            placeholder="Rechercher un client..."
            value={clientSearch}
            onChangeText={setClientSearch}
            style={styles.input}
          />
          {clientSearch.length > 0 && (
            <View style={styles.productDropdown}>
              <ScrollView>
                {filteredClients?.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.dropdownItem}
                    onPress={() =>
                      setFormData({
                        ...formData,
                        clientId: item.id,
                        clientName: item.name,
                      })
                    }
                  >
                    <Text style={styles.dropdownText}>{item.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </>
      )}

      {/* PRODUITS */}
      <View style={styles.productSearchWrapper}>
        <Text style={styles.label}>Produit</Text>
        <TextInput
          placeholder="Rechercher un produit..."
          value={productSearch}
          onChangeText={setProductSearch}
          style={styles.input}
        />

        {productSearch.length > 0 && (
          <View style={styles.productDropdown}>
            <ScrollView>
              {filteredProducts?.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.dropdownItem}
                  onPress={() => addProductToOrder(item.id)}
                >
                  <Text style={styles.dropdownText}>
                    {item.name} — Stock {item.quantity}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>

      {/* LIGNES */}
      {formData.order.map((line, index) => {
        const product = products?.find((p) => p.id === line.productId);
        const stockError = getStockError(line.productId);

        return (
          <View
            key={index}
            style={[styles.lineBoxCompact, stockError && styles.errorBox]}
          >
            <View style={styles.productHeaderCompact}>
              <Text style={styles.productName}>{product?.name}</Text>
              <TouchableOpacity onPress={() => removeOrderLine(index)}>
                <Text style={styles.removeText}>✕</Text>
              </TouchableOpacity>
            </View>

            {stockError && (
              <Text style={styles.errorTextCompact}>{stockError.error}</Text>
            )}

            <View style={styles.controlsRow}>
              <Picker
                selectedValue={line.unit}
                onValueChange={(v) => updateOrderLine(index, "unit", v)}
                style={styles.pickerCompact}
              >
                {product?.units?.map((u) => (
                  <Picker.Item
                    key={u.type}
                    label={`${u.type} • ${u.salePrice} Ar`}
                    value={u.type}
                  />
                ))}
              </Picker>

              <TextInput
                keyboardType="numeric"
                value={line.quantity}
                style={styles.qtyInput}
                onChangeText={(v) => updateOrderLine(index, "quantity", v)}
              />
            </View>
          </View>
        );
      })}

      <Text style={styles.total}>Total : {computedOrder?.total} Ar</Text>

      <View style={styles.actions}>
        <SaveButton onPress={handleSubmit} />
        <CancelButton onPress={onCancel} />
      </View>
    </KeyboardAvoidingView>
  );
};

export default CreateOrderForm;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark.surface,
    padding: 20,
    borderRadius: 16,
    maxHeight: "90%",
    overflowY: "scroll",
    paddingVertical: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 16,
    color: Colors.dark.text,
  },
  label: {
    fontWeight: "600",
    marginBottom: 6,
    color: Colors.dark.text,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.dark.border,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    backgroundColor: Colors.dark.surface,
    color: Colors.dark.text,
  },
  dropdown: {
    backgroundColor: Colors.dark.surface,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    borderRadius: 10,
    maxHeight: 160,
    marginBottom: 10,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  dropdownText: {
    fontSize: 15,
    color: Colors.dark.text,
  },
  selectedBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: Colors.dark.success + "33",
    borderColor: Colors.dark.success,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  selectedText: {
    color: Colors.dark.success,
    fontWeight: "600",
  },
  clearText: {
    color: Colors.dark.success,
    fontWeight: "600",
  },
  lineBoxCompact: {
    borderWidth: 1,
    borderColor: Colors.dark.border,
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    backgroundColor: Colors.dark.surface,
  },
  errorBox: {
    borderColor: Colors.dark.danger,
  },
  productHeaderCompact: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  productName: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.dark.text,
  },
  removeText: {
    fontSize: 18,
    color: Colors.dark.danger,
    fontWeight: "700",
  },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 8,
  },
  pickerCompact: {
    width: 100,
    minHeight: 36,
    flex: 1,
    borderRadius: 5,
    borderWidth: 0.5,
    backgroundColor: "transparent",
    color: Colors.dark.text,
  },
  qtyInput: {
    width: 70,
    height: 36,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    borderRadius: 8,
    textAlign: "center",
    color: Colors.dark.text,
    backgroundColor: Colors.dark.surface,
  },
  errorTextCompact: {
    fontSize: 12,
    color: Colors.dark.danger,
    marginTop: 4,
  },
  total: {
    textAlign: "right",
    fontSize: 18,
    fontWeight: "700",
    color: Colors.dark.success,
    marginVertical: 12,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 12,
  },

  // product dropdown
  productSearchWrapper: {
    position: "relative",
    zIndex: 100, // très important
  },

  productDropdown: {
    maxHeight: 180,
    backgroundColor: Colors.dark.surface,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    borderRadius: 10,
    zIndex: 1000,
    elevation: 10, // ANDROID
  },
});
