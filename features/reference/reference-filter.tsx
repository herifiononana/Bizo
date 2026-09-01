import { ModalTrigger } from "@/components/modal-trigger";
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
  // Position du bouton par défaut (ignorée si `trigger` est fourni).
  top?: number;
  right?: number;
  // Bouton d'ouverture personnalisable — par défaut une icône filtre positionnée en absolu.
  trigger?: ModalTrigger;
};

export default function ReferenceFilterModal({
  selectedReference,
  setSelectedReference,
  right = 10,
  top = 205,
  trigger,
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
      {trigger ? (
        trigger({ onPress: () => setOpen(true) })
      ) : (
        <View style={{ ...styles.container, top, right }}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setOpen(true)}
          >
            <Ionicons name="filter" size={22} color="#FFF" />
          </TouchableOpacity>
        </View>
      )}

      {/* --- MODAL --- */}
      <Modal
        transparent
        animationType="slide"
        visible={open}
        onRequestClose={() => setOpen(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modalContent}>
            <View style={styles.grabHandle} />
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
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    zIndex: 10,
  },

  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#1B2342",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    alignItems: "center",
    justifyContent: "center",
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(5,8,18,0.75)",
    justifyContent: "flex-end",
  },

  modalContent: {
    backgroundColor: "#141B33",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },

  grabHandle: {
    width: 40,
    height: 4,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 999,
    alignSelf: "center",
    marginBottom: 16,
  },

  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#F4F6FF",
    marginBottom: 16,
  },

  row: {
    flexDirection: "row",
    paddingBottom: 10,
  },

  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: "#1B2342",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    margin: 4,
  },

  chipActive: {
    backgroundColor: "rgba(249,115,22,0.14)",
    borderColor: "rgba(249,115,22,0.32)",
  },

  chipText: {
    color: "#B7BFD8",
    fontWeight: "600",
    fontSize: 13,
  },

  chipTextActive: {
    color: "#FB923C",
  },

  closeButton: {
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: "#F97316",
  },

  closeText: {
    textAlign: "center",
    fontWeight: "600",
    color: "#fff",
  },
});
