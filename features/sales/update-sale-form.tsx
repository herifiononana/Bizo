import { CancelButton } from "@/components/cancel-button";
import { SaveButton } from "@/components/save-button";
import { Colors } from "@/constants/theme";
import { useFinance } from "@/hooks/finance/useFinance";
import { Sale } from "@/interface/sale/sale";
import { saveProducts } from "@/services/product";
import { saveSales, updateLocalSales } from "@/services/sale";
import { useProductsStore } from "@/stores/product.store";
import { useSalesStore } from "@/stores/sales.store";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
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
  const [currentProductId, setCurrentProductId] = useState<string>(
    sale.productId
  );

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
      // Cas 1 : ancien produit → on restitue l'ancien stock
      if (
        product.id === sale.productId &&
        sale.productId !== updatedSale.productId
      ) {
        return {
          ...product,
          quantity: product.quantity + sale.quantity,
        };
      }

      // Cas 2 : nouveau produit → on retire la nouvelle quantité
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

    // 1. Mettre à jour les ventes
    const updatedSales = [updatedSale, ...sales];
    setSales(updatedSales);

    // 2. Mettre à jour le stock
    const updatedProducts = handleUpdateProductStock(updatedSale);

    // 3. Sauvegarder dans AsyncStorage
    try {
      const data = await updateLocalSales(sales, updatedSale);
      await saveSales(data);
      setSales(data);
      await saveProducts(updatedProducts);
      setProducts(updatedProducts);
    } catch (e) {
      console.log("Erreur de sauvegarde :", e);
    }

    // Mettre a jour l'etat de la finance
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

  // Produits filtrés pour l’autocomplete
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

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={styles.title}>🛒 Nouvelle vente</Text>

      {/* Recherche et sélection produit */}
      <Text style={styles.label}>Produit :</Text>
      {selectedProduct ? (
        <View style={styles.selectedBox}>
          <Text style={styles.selectedText}>
            {selectedProduct.name} — Stock : {selectedProduct.quantity}
          </Text>
          <TouchableOpacity
            onPress={() => {
              setCurrentProductId("");
              setFormData({ ...formData, totalPrice: "", productId: "" });
            }}
          >
            <Text style={styles.clearText}>Changer ✏️</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <TextInput
            placeholder="Rechercher un produit..."
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

      {/* Quantité */}
      <Text style={styles.label}>Quantité vendue :</Text>
      <TextInput
        placeholder="Ex: 5"
        style={[styles.input, errors.quantity && styles.errorInput]}
        keyboardType="numeric"
        value={formData.quantity}
        onChangeText={(text) => {
          const total = selectedProduct?.salePrice
            ? Number(text) * selectedProduct?.salePrice
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

      {/* Prix */}
      <Text style={styles.label}>Prix de vente (Ar) :</Text>
      <TextInput
        placeholder="Ex: 2500"
        style={[styles.input, errors.salePrice && styles.errorInput]}
        keyboardType="numeric"
        value={formData.salePrice}
        onChangeText={(text) => setFormData({ ...formData, salePrice: text })}
      />
      {errors.salePrice && (
        <Text style={styles.errorText}>{errors.salePrice}</Text>
      )}

      {/* Prix */}
      <Text style={styles.label}>Total (Ar) :</Text>
      <TextInput
        placeholder="Ex: 2500"
        style={[styles.input, errors.totalPrice && styles.errorInput]}
        keyboardType="numeric"
        value={formData.totalPrice}
        onChangeText={(text) => {
          const quantitySold = selectedProduct?.salePrice
            ? Number(text) / selectedProduct.salePrice
            : Number(formData.quantity);

          setFormData({
            ...formData,
            totalPrice: text,
            quantity: String(quantitySold.toFixed(3)),
          });
        }}
      />
      {errors.salePrice && (
        <Text style={styles.errorText}>{errors.salePrice}</Text>
      )}

      {/* Vente à crédit */}
      <View style={styles.creditRow}>
        <Text style={styles.label}>Vente à crédit :</Text>
        <Switch
          value={formData.isCredit}
          onValueChange={(value) =>
            setFormData({ ...formData, isCredit: value })
          }
          thumbColor={formData.isCredit ? "#16A34A" : "#f4f3f4"}
          trackColor={{ false: "#D1D5DB", true: "#A7F3D0" }}
        />
      </View>

      {/* Nom du client */}
      {formData.isCredit && (
        <>
          <Text style={styles.label}>Nom du client :</Text>
          <TextInput
            placeholder="Ex: Tamby"
            style={[styles.input, errors.clientName && styles.errorInput]}
            value={formData.clientName}
            onChangeText={(text) =>
              setFormData({ ...formData, clientName: text })
            }
          />
        </>
      )}

      {/* Boutons */}
      <View style={styles.actions}>
        <CancelButton onPress={onCancel} />
        <SaveButton onPress={handleSubmit} />
      </View>
    </KeyboardAvoidingView>
  );
};

export default UpdateSaleForm;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0F1535",
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 16,
    color: "#FFFFFF",
  },
  label: {
    fontWeight: "600",
    marginBottom: 6,
    color: "#FFFFFF",
    fontSize: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    borderRadius: 12,
    padding: 11,
    marginBottom: 10,
    backgroundColor: "#172049",
    color: "#FFFFFF",
  },
  errorInput: {
    borderColor: Colors.dark.danger,
  },
  errorText: {
    color: Colors.dark.danger,
    fontSize: 13,
    marginBottom: 6,
  },
  dropdown: {
    backgroundColor: "#172049",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    borderRadius: 12,
    maxHeight: 150,
    marginTop: 4,
  },
  dropdownItem: {
    padding: 11,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },
  dropdownText: {
    fontSize: 15,
    color: "#FFFFFF",
  },
  selectedBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "rgba(34,197,94,0.12)",
    borderColor: Colors.dark.success,
    borderWidth: 1,
    borderRadius: 12,
    padding: 11,
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
  creditRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
});
