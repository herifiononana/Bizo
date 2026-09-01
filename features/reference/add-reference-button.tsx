import { CancelButton } from "@/components/cancel-button";
import { ModalTrigger } from "@/components/modal-trigger";
import { SaveButton } from "@/components/save-button";
import SecureConfirmModal from "@/components/secure-confirm-modal";
import ReferenceListRow from "@/features/reference/reference-list-row";
import { useReference } from "@/hooks/reference/useRefecence";
import { Reference } from "@/interface/reference";
import { useProductsStore } from "@/stores/product.store";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type PendingReferenceDelete = { reference: Reference; cascade: boolean };

type AddReferenceButtonProps = {
  // Bouton d'ouverture personnalisable — par défaut une icône réglages.
  trigger?: ModalTrigger;
};

const DefaultTrigger: ModalTrigger = ({ onPress }) => (
  <View style={styles.container}>
    <TouchableOpacity style={styles.iconButton} onPress={onPress}>
      <Ionicons name="settings-outline" size={22} color="#FFF" />
    </TouchableOpacity>
  </View>
);

const AddReferenceButton = ({ trigger }: AddReferenceButtonProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [refName, setRefName] = useState("");
  const [editingReference, setEditingReference] = useState<Reference | null>(
    null
  );
  const [pendingDelete, setPendingDelete] =
    useState<PendingReferenceDelete | null>(null);
  const { references, addReference, updateReference, deleteReference } =
    useReference();
  const products = useProductsStore((state) => state.products);

  const closeModal = () => {
    setModalVisible(false);
    setEditingReference(null);
    setRefName("");
  };

  const handleStartEdit = (reference: Reference) => {
    setEditingReference(reference);
    setRefName(reference.name);
  };

  const handleSave = () => {
    if (!refName.trim()) return;
    if (editingReference) {
      updateReference(editingReference.id, refName.trim().toUpperCase());
    } else {
      addReference({
        id: new Date().toISOString(),
        name: refName.trim().toUpperCase(),
      });
    }
    setEditingReference(null);
    setRefName("");
  };

  const handleDelete = (reference: Reference) => {
    const productCount = (products ?? []).filter(
      (product) => product.referenceId === reference.id
    ).length;

    // Référence sans produit associé : suppression directe, sans mot de passe.
    if (productCount === 0) {
      Alert.alert(
        "Supprimer la référence",
        `Voulez-vous vraiment supprimer "${reference.name}" ?`,
        [
          { text: "Annuler", style: "cancel" },
          {
            text: "Supprimer",
            style: "destructive",
            onPress: () => deleteReference(reference.id, false),
          },
        ]
      );
      return;
    }

    // Référence associée à des produits : mot de passe requis quel que soit le choix.
    Alert.alert(
      "Supprimer la référence",
      `${productCount} produit(s) sont associés à "${reference.name}". Que faire des produits associés ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Conserver les produits",
          onPress: () => setPendingDelete({ reference, cascade: false }),
        },
        {
          text: "Supprimer aussi les produits",
          style: "destructive",
          onPress: () => setPendingDelete({ reference, cascade: true }),
        },
      ]
    );
  };

  const handleConfirmedDelete = async () => {
    if (!pendingDelete) return;
    await deleteReference(pendingDelete.reference.id, pendingDelete.cascade);
    setPendingDelete(null);
  };

  return (
    <>
      {trigger ? trigger({ onPress: () => setModalVisible(true) }) : (
        <DefaultTrigger onPress={() => setModalVisible(true)} />
      )}

      {/* --- Modal gestion des références --- */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingReference ? "Modifier la référence" : "Nouvelle référence"}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Nom de la référence"
              value={refName}
              onChangeText={setRefName}
            />

            <View style={styles.actions}>
              <SaveButton onPress={handleSave} />
              <CancelButton
                onPress={
                  editingReference
                    ? () => {
                        setEditingReference(null);
                        setRefName("");
                      }
                    : closeModal
                }
              />
            </View>

            {!!references?.length && (
              <>
                <Text style={styles.listTitle}>Références existantes</Text>
                <ScrollView style={styles.list}>
                  {references.map((reference) => (
                    <ReferenceListRow
                      key={reference.id}
                      reference={reference}
                      onEdit={() => handleStartEdit(reference)}
                      onDelete={() => handleDelete(reference)}
                    />
                  ))}
                </ScrollView>
              </>
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <SecureConfirmModal
        visible={!!pendingDelete}
        title="Confirmer la suppression"
        message={
          pendingDelete?.cascade
            ? `Les produits associés à "${pendingDelete.reference.name}" seront aussi supprimés. Cette action est irréversible.`
            : `"${pendingDelete?.reference.name}" sera supprimée. Les produits associés seront conservés sans référence.`
        }
        confirmLabel="Supprimer"
        onConfirmed={handleConfirmedDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  );
};

export default AddReferenceButton;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 150,
    right: 10,
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

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(5,8,18,0.75)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  modalContent: {
    backgroundColor: "#141B33",
    borderRadius: 28,
    padding: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    width: "100%",
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#F4F6FF",
    marginBottom: 16,
    textAlign: "center",
  },

  input: {
    backgroundColor: "#1B2342",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    padding: 14,
    height: 50,
    color: "#F4F6FF",
    marginBottom: 16,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },

  listTitle: {
    fontSize: 12,
    color: "#7A83A2",
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginTop: 20,
    marginBottom: 10,
  },

  list: {
    maxHeight: 220,
  },
});
