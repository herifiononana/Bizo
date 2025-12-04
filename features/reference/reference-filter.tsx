import { Colors } from "@/constants/theme";
import { useReference } from "@/hooks/reference/useRefecence";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type ReferenceFilterProps = {
  selectedReference?: string | null;
  setSelectedReference: (reference?: string | null) => void;
};

export default function ReferenceFilterModal({
  selectedReference,
  setSelectedReference,
}: ReferenceFilterProps) {
  const { references } = useReference();
  const [open, setOpen] = useState(false);

  if (!references?.length) return null;

  const selectRef = (ref?: string | null) => {
    setSelectedReference(ref ?? null);
    setOpen(false);
  };

  return (
    <>
      {/* --- BOUTON QUI OUVRE LE MODAL --- */}
      <TouchableOpacity style={styles.iconButton} onPress={() => setOpen(true)}>
        <Ionicons name="filter" size={20} color="#FFF" />
      </TouchableOpacity>

      {/* --- MODAL --- */}
      <Modal
        transparent
        animationType="slide"
        visible={open}
        onRequestClose={() => setOpen(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Filtrer par référence</Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.row}
            >
              {/* TOUS */}
              <TouchableOpacity
                style={[
                  styles.chip,
                  selectedReference === null && styles.chipActive,
                ]}
                onPress={() => selectRef(null)}
              >
                <Text
                  style={[
                    styles.chipText,
                    selectedReference === null && styles.chipTextActive,
                  ]}
                >
                  Tous
                </Text>
              </TouchableOpacity>

              {references.map((ref) => (
                <TouchableOpacity
                  key={ref.id}
                  style={[
                    styles.chip,
                    selectedReference === ref.id && styles.chipActive,
                  ]}
                  onPress={() => selectRef(ref.id)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      selectedReference === ref.id && styles.chipTextActive,
                    ]}
                  >
                    {ref.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* FERMER */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setOpen(false)}
            >
              <Text style={styles.closeText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    alignSelf: "flex-start",
    backgroundColor: Colors.dark.primary, // couleur primaire
    borderWidth: 1,
    borderColor: Colors.dark.primary,
    padding: 8,
    borderRadius: 50,
    marginBottom: 8,
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },

  modalContent: {
    backgroundColor: Colors.dark.surface, // surface sombre
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
    color: Colors.dark.text, // texte clair
  },

  row: {
    flexDirection: "row",
    paddingBottom: 10,
  },

  chip: {
    backgroundColor: Colors.dark.surface, // fond sombre
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 50,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.dark.border, // bordure thème
  },

  chipActive: {
    backgroundColor: Colors.dark.accent, // accent orange
    borderColor: Colors.dark.accent,
    shadowColor: Colors.dark.accent,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },

  chipText: {
    color: Colors.dark.text, // texte clair
    fontSize: 14,
  },

  chipTextActive: {
    color: "#fff",
    fontWeight: "600",
  },

  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: Colors.dark.primary, // bouton fermer thème sombre
  },

  closeText: {
    textAlign: "center",
    fontWeight: "600",
    color: "#fff",
  },
});
