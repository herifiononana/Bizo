import { ModalTrigger } from "@/components/modal-trigger";
import { SUGGESTION_FIELD_GROUPS } from "@/constants/suggestion-fields";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type SuggestionHelpModalProps = {
  // Bouton d'ouverture personnalisable — par défaut une icône aide.
  trigger?: ModalTrigger;
};

const DefaultTrigger: ModalTrigger = ({ onPress }) => (
  <TouchableOpacity style={styles.defaultTrigger} onPress={onPress}>
    <Ionicons name="help-circle-outline" size={20} color="#F4F6FF" />
  </TouchableOpacity>
);

const matchesQuery = (text: string, query: string) =>
  text.toLowerCase().includes(query.toLowerCase());

const SuggestionHelpModal = ({ trigger }: SuggestionHelpModalProps) => {
  const [visible, setVisible] = useState(false);
  const onClose = () => setVisible(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredGroups = useMemo(() => {
    const query = searchQuery.trim();
    if (!query) return SUGGESTION_FIELD_GROUPS;

    return SUGGESTION_FIELD_GROUPS.map((group) => ({
      ...group,
      fields: group.fields.filter(
        (field) =>
          matchesQuery(field.label, query) || matchesQuery(field.description, query)
      ),
    })).filter((group) => group.fields.length > 0);
  }, [searchQuery]);

  return (
    <>
      {trigger ? trigger({ onPress: () => setVisible(true) }) : (
        <DefaultTrigger onPress={() => setVisible(true)} />
      )}

      <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.screen}>
        <StatusBar barStyle="light-content" backgroundColor="#0C1224" />

        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Aide de l&apos;assistant IA</Text>
            <Text style={styles.headerSubtitle}>
              À quoi sert chaque paramètre des suggestions
            </Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={22} color="#F4F6FF" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchRow}>
          <Ionicons
            name="search"
            size={18}
            color="#545C7A"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un paramètre…"
            placeholderTextColor="#545C7A"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <ScrollView
          contentContainerStyle={styles.body}
          showsVerticalScrollIndicator={false}
        >
          {filteredGroups.length === 0 ? (
            <Text style={styles.emptyText}>
              Aucun paramètre ne correspond à cette recherche.
            </Text>
          ) : (
            filteredGroups.map((group) => (
              <View key={group.title} style={styles.section}>
                <Text style={styles.sectionTitle}>{group.title}</Text>
                {group.fields.map((field) => (
                  <View key={field.key} style={styles.card}>
                    <Text style={styles.cardTitle}>{field.label}</Text>
                    <Text style={styles.cardDescription}>{field.description}</Text>
                  </View>
                ))}
              </View>
            ))
          )}
        </ScrollView>
      </View>
      </Modal>
    </>
  );
};

export default SuggestionHelpModal;

const styles = StyleSheet.create({
  defaultTrigger: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#1B2342",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  screen: {
    flex: 1,
    backgroundColor: "#0C1224",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  headerText: { flex: 1, paddingRight: 12 },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#F4F6FF",
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#7A83A2",
    marginTop: 4,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#1B2342",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1B2342",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    paddingHorizontal: 14,
    height: 50,
    marginHorizontal: 20,
    marginTop: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#F4F6FF",
  },

  body: {
    padding: 20,
    paddingBottom: 60,
  },

  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    color: "#7A83A2",
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 12,
  },

  card: {
    backgroundColor: "#141B33",
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#F4F6FF",
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13,
    color: "#B7BFD8",
    lineHeight: 19,
  },

  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: "#7A83A2",
    fontSize: 15,
  },
});
