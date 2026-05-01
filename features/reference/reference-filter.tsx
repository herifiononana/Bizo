import { OTHER_REFERENCE } from "@/constants/constants";
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
  top?: number;
  right?: number;
};

export default function ReferenceFilterModal({
  selectedReference,
  setSelectedReference,
  right = 10,
  top = 205,
}: ReferenceFilterProps) {
  const { references } = useReference();
  const [open, setOpen] = useState(false);

  if (!references?.length) return null;

  const selectRef = (ref?: string | null) => {
    setSelectedReference(ref ?? null);
    setOpen(false);
  };

  return (
    <View style={{ ...styles.container, top, right }}>
      {/* --- BOUTON QUI OUVRE LE MODAL --- */}
      <TouchableOpacity style={styles.iconButton} onPress={() => setOpen(true)}>
        <Ionicons name="filter" size={22} color="#FFF" />
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
              <TouchableOpacity
                style={[
                  styles.chip,
                  selectedReference === OTHER_REFERENCE && styles.chipActive,
                ]}
                onPress={() => selectRef(OTHER_REFERENCE)}
              >
                <Text
                  style={[
                    styles.chipText,
                    selectedReference === OTHER_REFERENCE &&
                      styles.chipTextActive,
                  ]}
                >
                  Autres
                </Text>
              </TouchableOpacity>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    zIndex: 10,
  },

  iconButton: {
    padding: 11,
    backgroundColor: Colors.dark.accent,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.dark.accent,
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "flex-end",
  },

  modalContent: {
    backgroundColor: "#0F1535",
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
    color: "#FFFFFF",
  },

  row: {
    flexDirection: "row",
    paddingBottom: 10,
  },

  chip: {
    backgroundColor: "#172049",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 50,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },

  chipActive: {
    backgroundColor: Colors.dark.accent,
    borderColor: Colors.dark.accent,
    shadowColor: Colors.dark.accent,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },

  chipText: {
    color: "#8891B3",
    fontSize: 14,
  },

  chipTextActive: {
    color: "#fff",
    fontWeight: "600",
  },

  closeButton: {
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.dark.accent,
  },

  closeText: {
    textAlign: "center",
    fontWeight: "600",
    color: "#fff",
  },
});
