import { Colors } from "@/constants/theme";
import AddClientButton from "@/features/client/add-client-button";
import { useClients } from "@/hooks/clients/useClient";
import React, { useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";

const ClientsScreen = () => {
  const { clients } = useClients();
  const [search, setSearch] = useState<string>("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👥 Clients</Text>
      {/* Recherche */}
      <TextInput
        placeholder="Rechercher par nom ou téléphone"
        placeholderTextColor={Colors.dark.icon}
        style={styles.searchInput}
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={clients}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Aucun client trouvé</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>
              {item.civility} {item.name}
            </Text>

            <Text style={styles.info}>📞 {item.phone}</Text>

            {item.email ? (
              <Text style={styles.info}>✉️ {item.email}</Text>
            ) : null}

            <Text style={styles.address}>📍 {item.address}</Text>
          </View>
        )}
        initialNumToRender={15}
        maxToRenderPerBatch={15}
        windowSize={10}
        updateCellsBatchingPeriod={50}
        removeClippedSubviews={true}
      />
      <AddClientButton />
    </View>
  );
};

export default ClientsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    padding: 16,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.dark.text,
    textAlign: "center",
    marginBottom: 14,
  },

  searchInput: {
    backgroundColor: Colors.dark.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    padding: 12,
    fontSize: 16,
    color: Colors.dark.text,
    marginBottom: 12,
  },

  card: {
    backgroundColor: Colors.dark.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    shadowColor: Colors.dark.shadow,
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },

  name: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.dark.text,
    marginBottom: 4,
  },

  info: {
    fontSize: 14,
    color: Colors.dark.icon,
  },

  address: {
    fontSize: 13,
    color: Colors.dark.icon,
    marginTop: 6,
  },

  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: Colors.dark.icon,
    fontSize: 15,
  },
});
