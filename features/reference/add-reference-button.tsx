// import { useReference } from "@/hooks/reference/useRefecence";
// import React, { useState } from "react";
// import {
//   Modal,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";

// const AddReferenceButton = () => {
//   const [modalVisible, setModalVisible] = useState(false);
//   const [refName, setRefName] = useState("");
//   const { addReference } = useReference();

//   const handleAdd = () => {
//     if (!refName.trim()) return;
//     addReference({
//       id: new Date().toISOString(),
//       name: refName.trim().toUpperCase(),
//     });
//     setRefName("");
//     setModalVisible(false);
//   };

//   return (
//     <>
//       <TouchableOpacity
//         style={styles.button}
//         onPress={() => setModalVisible(true)}
//       >
//         <Text style={styles.buttonText}>+ Ajouter une référence</Text>
//       </TouchableOpacity>

//       <Modal visible={modalVisible} transparent animationType="slide">
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Nouvelle référence</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="Nom de la référence"
//               value={refName}
//               onChangeText={setRefName}
//             />
//             <View style={styles.actions}>
//               <TouchableOpacity
//                 style={styles.cancelButton}
//                 onPress={() => setModalVisible(false)}
//               >
//                 <Text style={styles.cancelText}>Annuler</Text>
//               </TouchableOpacity>
//               <TouchableOpacity style={styles.saveButton} onPress={handleAdd}>
//                 <Text style={styles.saveText}>Ajouter</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </>
//   );
// };

// export default AddReferenceButton;

// const styles = StyleSheet.create({
//   button: {
//     paddingVertical: 6,
//     paddingHorizontal: 10,
//     backgroundColor: "#E0F2FE",
//     borderRadius: 50,
//     alignSelf: "flex-start",
//     marginVertical: 8,
//   },
//   buttonText: { color: "#0EA5E9", fontWeight: "600" },

//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "#00000066",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   modalContent: {
//     backgroundColor: "#fff",
//     padding: 20,
//     borderRadius: 12,
//     width: "80%",
//   },
//   modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
//   input: {
//     borderWidth: 1,
//     borderColor: "#CBD5E1",
//     borderRadius: 8,
//     padding: 10,
//     marginBottom: 16,
//   },
//   actions: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: 16,
//     gap: 10,
//   },
//   saveButton: {
//     flex: 1,
//     backgroundColor: "#16A34A",
//     paddingVertical: 10,
//     borderRadius: 10,
//     alignItems: "center",
//     shadowColor: "#16A34A",
//     shadowOpacity: 0.2,
//     shadowOffset: { width: 0, height: 3 },
//   },
//   cancelButton: {
//     flex: 1,
//     backgroundColor: "#F3F4F6",
//     paddingVertical: 10,
//     borderRadius: 10,
//     alignItems: "center",
//   },
//   saveText: {
//     color: "#FFFFFF",
//     fontWeight: "700",
//     fontSize: 16,
//   },
//   cancelText: {
//     color: "#374151",
//     fontWeight: "700",
//     fontSize: 16,
//   },
// });
import { useReference } from "@/hooks/reference/useRefecence";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const AddReferenceButton = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [refName, setRefName] = useState("");
  const { addReference } = useReference();

  const handleAdd = () => {
    if (!refName.trim()) return;
    addReference({
      id: new Date().toISOString(),
      name: refName.trim().toUpperCase(),
    });
    setRefName("");
    setModalVisible(false);
  };

  return (
    <>
      {/* --- Petit bouton icône paramètre --- */}
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="settings-outline" size={22} color="#0EA5E9" />
      </TouchableOpacity>

      {/* --- Modal ajout référence --- */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nouvelle référence</Text>

            <TextInput
              style={styles.input}
              placeholder="Nom de la référence"
              value={refName}
              onChangeText={setRefName}
            />

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelText}>Annuler</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.saveButton} onPress={handleAdd}>
                <Text style={styles.saveText}>Ajouter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default AddReferenceButton;

const styles = StyleSheet.create({
  iconButton: {
    padding: 6,
    backgroundColor: "#E0F2FE",
    borderRadius: 50,
    alignSelf: "flex-start",
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#BAE6FD",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "#00000066",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    width: "80%",
  },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12 },

  input: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    gap: 10,
  },

  saveButton: {
    flex: 1,
    backgroundColor: "#16A34A",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },

  saveText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
  cancelText: {
    color: "#374151",
    fontWeight: "700",
    fontSize: 16,
  },
});
