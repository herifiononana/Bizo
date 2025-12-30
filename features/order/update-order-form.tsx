import { Picker } from "@react-native-picker/picker";
import React, { useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
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
import { TypeUnit } from "@/interface/product/product";
import { saveOrders } from "@/services/order";
import { saveProducts } from "@/services/product";
import { useClientsStore } from "@/stores/client.store";
import { useOrdersStore } from "@/stores/order.store";
import { useProductsStore } from "@/stores/product.store";

/* =======================
 * Types
 * ======================= */

type OrderLineForm = {
  productId: string;
  unit: TypeUnit;
  quantity: string;
};

type StockError = {
  productId: string;
  message: string;
};

type ComputedOrder = {
  items: {
    productId: string;
    productName: string;
    unit: TypeUnit;
    quantity: number;
    unitPrice: number;
    stockImpact: number;
    subTotal: number;
  }[];
  total: number;
  errors: StockError[];
};

interface UpdateOrderFormProps {
  order: Order;
  onCancel: () => void;
}

/* =======================
 * Component
 * ======================= */

const UpdateOrderForm = ({ order, onCancel }: UpdateOrderFormProps) => {
  const { products, setProducts } = useProductsStore();
  const { clients } = useClientsStore();
  const { orders, setOrders } = useOrdersStore();

  const [clientSearch, setClientSearch] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    clientId: order.clientId,
    clientName: order.clientName,
    order: order.order.map<OrderLineForm>((l) => ({
      productId: l.productId,
      unit: l.unit,
      quantity: String(l.quantity),
    })),
  });

  /* =======================
   * Filters
   * ======================= */

  const filteredClients = useMemo(
    () =>
      clients?.filter((c) =>
        c.name.toLowerCase().includes(clientSearch.toLowerCase())
      ),
    [clients, clientSearch]
  );

  const filteredProducts = useMemo(
    () =>
      products?.filter((p) =>
        p.name.toLowerCase().includes(productSearch.toLowerCase())
      ),
    [products, productSearch]
  );

  /* =======================
   * Order manipulation
   * ======================= */

  const updateLine = (
    index: number,
    field: keyof OrderLineForm,
    value: string
  ) => {
    setFormData((prev) => {
      const next = [...prev.order];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, order: next };
    });
  };

  const removeLine = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      order: prev.order.filter((_, i) => i !== index),
    }));
  };

  const addProduct = (productId: string) => {
    const product = products?.find((p) => p.id === productId);
    if (!product || !product.units?.length) return;

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

  /* =======================
   * Computation
   * ======================= */

  const computedOrder: ComputedOrder | null = useMemo(() => {
    if (!products) return null;

    let total = 0;
    const errors: StockError[] = [];

    const items = formData.order.flatMap((line) => {
      const product = products.find((p) => p.id === line.productId);
      if (!product) return [];

      const unit = product.units?.find((u) => u.type === line.unit);
      if (!unit) return [];

      const quantity = Number(line.quantity);
      const stockImpact = quantity * unit.conversion;

      if (stockImpact > product.quantity) {
        errors.push({
          productId: product.id,
          message: `Stock insuffisant pour ${product.name}`,
        });
        return [];
      }

      const subTotal = quantity * unit.salePrice;
      total += subTotal;

      return [
        {
          productId: product.id,
          productName: product.name,
          unit: unit.type,
          quantity,
          unitPrice: unit.salePrice,
          stockImpact,
          subTotal,
        },
      ];
    });

    return { items, total, errors };
  }, [formData.order, products]);

  const getStockError = (productId: string) =>
    computedOrder?.errors.find((e) => e.productId === productId);

  /* =======================
   * Submit
   * ======================= */

  const handleSubmit = async () => {
    if (!computedOrder || !products || !orders) return;

    const dto: OrderDTO = {
      clientId: formData.clientId,
      clientName: formData.clientName,
      order: computedOrder.items.map((i) => ({
        productId: i.productId,
        productName: i.productName,
        unit: i.unit,
        quantity: String(i.quantity),
        unitPrice: String(i.unitPrice),
        stockImpact: String(i.stockImpact),
        subTotal: String(i.subTotal),
      })),
      total: String(computedOrder.total),
    };

    const parsed = OrderSchema.safeParse(dto);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.errors.forEach((e) => {
        errs[String(e.path[0])] = e.message;
      });
      setFormErrors(errs);
      return;
    }

    const updatedOrder: Order = {
      ...order,
      ...parsed.data,
      order: parsed.data.order.map((o) => ({
        productId: o.productId,
        productName: o.productName,
        unit: o.unit,
        quantity: Number(o.quantity),
        unitPrice: Number(o.unitPrice),
        stockImpact: Number(o.stockImpact),
        subTotal: Number(o.subTotal),
      })),
      total: Number(parsed.data.total),
      updatedAt: new Date().toISOString(),
    };

    const updatedOrders = orders.map((o) =>
      o.id === updatedOrder.id ? updatedOrder : o
    );

    const updatedProducts = products.map((product) => {
      const oldImpact = order.order
        .filter((i) => i.productId === product.id)
        .reduce((s, i) => s + i.stockImpact, 0);

      const newImpact = updatedOrder.order
        .filter((i) => i.productId === product.id)
        .reduce((s, i) => s + i.stockImpact, 0);

      if (oldImpact === newImpact) return product;

      return {
        ...product,
        quantity: product.quantity + oldImpact - newImpact,
        updatedAt: new Date().toISOString(),
      };
    });

    await saveOrders(updatedOrders);
    await saveProducts(updatedProducts);

    setOrders(updatedOrders);
    setProducts(updatedProducts);

    Alert.alert("✅ Succès", "Commande mise à jour");
    onCancel();
  };

  /* =======================
   * UI
   * ======================= */

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <Text style={styles.title}>✏️ Modifier la commande</Text>

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
            <FlatList
              data={filteredClients}
              keyExtractor={(i) => i.id}
              style={styles.dropdown}
              renderItem={({ item }) => (
                <TouchableOpacity
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
              )}
            />
          )}
        </>
      )}

      {/* PRODUITS */}
      <Text style={styles.label}>Produit</Text>
      <TextInput
        placeholder="Rechercher un produit..."
        value={productSearch}
        onChangeText={setProductSearch}
        style={styles.input}
      />

      {productSearch.length > 0 && (
        <FlatList
          data={filteredProducts}
          keyExtractor={(i) => i.id}
          style={styles.dropdown}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => addProduct(item.id)}
            >
              <Text style={styles.dropdownText}>
                {item.name} — Stock {item.quantity}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* LIGNES */}
      {formData.order.map((line, index) => {
        const product = products?.find((p) => p.id === line.productId);
        const error = getStockError(line.productId);

        return (
          <View
            key={index}
            style={[styles.lineBoxCompact, error && styles.errorBox]}
          >
            <View style={styles.productHeaderCompact}>
              <Text style={styles.productName}>{product?.name}</Text>
              <TouchableOpacity onPress={() => removeLine(index)}>
                <Text style={styles.removeText}>✕</Text>
              </TouchableOpacity>
            </View>

            {error && (
              <Text style={styles.errorTextCompact}>{error.message}</Text>
            )}

            <View style={styles.controlsRow}>
              <Picker
                selectedValue={line.unit}
                onValueChange={(v) => updateLine(index, "unit", v)}
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
                onChangeText={(v) => updateLine(index, "quantity", v)}
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

export default UpdateOrderForm;

/* =======================
 * Styles
 * ======================= */

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
    height: 36,
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
});
