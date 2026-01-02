import { Colors } from "@/constants/theme";
import CreateOrderButton from "@/features/order/create-order-button";
import OrderListItem from "@/features/order/order-list-item";
import OrderListItemSkeleton from "@/features/order/order-list-item-skeleton";
import SendOrdersButton from "@/features/order/send-order-button";
import { useClients } from "@/hooks/clients/useClient";
import { useOrders } from "@/hooks/orders/useOrder";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const OrdersScreen = () => {
  useClients();
  const { loading, orders } = useOrders();
  const [search, setSearch] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [startPickerVisible, setStartPickerVisible] = useState(false);
  const [endPickerVisible, setEndPickerVisible] = useState(false);

  const filteredOrders = useMemo(() => {
    return orders?.filter((order) => {
      const matchesClient = order.clientName
        .toLowerCase()
        .includes(search.toLowerCase());

      const orderDate = order.createdAt ? new Date(order.createdAt) : null;

      const matchesStart = !startDate || (orderDate && orderDate >= startDate);

      const matchesEnd = !endDate || (orderDate && orderDate <= endDate);

      return matchesClient && matchesStart && matchesEnd;
    });
  }, [search, startDate, endDate, orders]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📦 Commandes</Text>

      {/* Recherche client */}
      <TextInput
        placeholder="🔍 Rechercher par client"
        value={search}
        onChangeText={setSearch}
        style={styles.searchInput}
      />

      {/* Filtres date */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setStartPickerVisible(true)}
        >
          <Text style={styles.dateText}>
            {startDate
              ? `Début: ${startDate.toLocaleDateString()}`
              : "📅 Date début"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setEndPickerVisible(true)}
        >
          <Text style={styles.dateText}>
            {endDate ? `Fin: ${endDate.toLocaleDateString()}` : "📅 Date fin"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Date pickers */}
      <DateTimePickerModal
        isVisible={startPickerVisible}
        mode="date"
        onConfirm={(date) => {
          setStartPickerVisible(false);
          setStartDate(date);
        }}
        onCancel={() => setStartPickerVisible(false)}
      />

      <DateTimePickerModal
        isVisible={endPickerVisible}
        mode="date"
        onConfirm={(date) => {
          setEndPickerVisible(false);
          setEndDate(date);
        }}
        onCancel={() => setEndPickerVisible(false)}
      />

      {/* Liste des commandes */}
      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Aucune commande trouvée</Text>
        }
        renderItem={({ item }) => {
          if (loading) return <OrderListItemSkeleton />;
          return <OrderListItem item={item} />;
        }}
      />
      <View style={styles.addButtonContainer}>
        <SendOrdersButton />
      </View>
      <CreateOrderButton />
    </View>
  );
};

export default OrdersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.dark.text,
    textAlign: "center",
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: Colors.dark.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    padding: 10,
    color: Colors.dark.text,
    marginBottom: 10,
  },
  filterRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 12,
  },
  dateButton: {
    flex: 1,
    backgroundColor: Colors.dark.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    paddingVertical: 8,
    alignItems: "center",
  },
  dateText: {
    color: Colors.dark.text,
    fontSize: 14,
  },
  emptyText: {
    marginTop: 40,
    textAlign: "center",
    color: Colors.dark.icon,
  },

  addButtonContainer: {
    position: "absolute",
    bottom: 80,
    right: 12,
  },
});
