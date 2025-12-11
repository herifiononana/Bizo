// import { useActivation } from "@/hooks/useActivation";
// import React, { useState } from "react";
// import {
//   Alert,
//   Modal,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";

// export default function ActivationModal() {
//   const { activate, isValid, showAlert } = useActivation();
//   const [key, setKey] = useState<string>("");

//   const VALID_KEY = "Bizo@2026";

//   const handleValidate = () => {
//     if (key !== VALID_KEY) {
//       Alert.alert("Erreur", "Clé incorrecte");
//       return;
//     }
//     activate();
//     Alert.alert("Activation", "L’application est activée pour 30 jours");
//   };

//   if (isValid) return <></>;

//   if (showAlert)
//     return (
//       <>{`Vous devriez appeler l'admin de votre application lors de votre prochaine utilisation parce que votre activation est deprecie`}</>
//     );

//   return (
//     <Modal visible transparent animationType="fade">
//       <View
//         style={{
//           flex: 1,
//           justifyContent: "center",
//           alignItems: "center",
//           backgroundColor: "rgba(0,0,0,0.6)",
//         }}
//       >
//         <View
//           style={{
//             backgroundColor: "#1F2937",
//             padding: 16,
//             borderRadius: 10,
//             width: "80%",
//           }}
//         >
//           <Text style={{ color: "white", marginBottom: 12, fontSize: 18 }}>
//             {`Entrez votre clé d'activation`}
//           </Text>

//           <TextInput
//             placeholder="Clé"
//             placeholderTextColor="#999"
//             style={{
//               backgroundColor: "#374151",
//               color: "white",
//               padding: 10,
//               borderRadius: 6,
//             }}
//             value={key}
//             onChangeText={setKey}
//           />

//           <TouchableOpacity
//             style={{
//               marginTop: 16,
//               backgroundColor: "#10B981",
//               padding: 10,
//               borderRadius: 6,
//             }}
//             onPress={handleValidate}
//           >
//             <Text style={{ textAlign: "center", color: "white", fontSize: 16 }}>
//               Valider
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </Modal>
//   );
// }
import { Colors } from "@/constants/theme";
import { useActivation } from "@/hooks/useActivation";
import React, { useState } from "react";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import ShowAlertActivation from "./show-alert-activation";

export default function ActivationModal() {
  const { activate, isValid, showAlert } = useActivation();
  const [key, setKey] = useState<string>("");

  const VALID_KEY = "Bizo@2026";

  const CONTACT_INFO = {
    phone: "+261 33 28 454 04",
    whatsapp: "+261 33 28 454 04",
    email: "heryfiononana19@gmail.com",
    appName: "Bizo",
  };

  const handleValidate = () => {
    if (key !== VALID_KEY) {
      alert("Erreur : Clé incorrecte.");
      return;
    }
    activate();
    alert(
      `Activation réussie.\n\nApplication : ${CONTACT_INFO.appName}\nValidité : 30 jours`
    );
  };

  // Si l’application est activée : ne rien afficher
  if (isValid && !showAlert) return <></>;

  // ---------- MODAL D'EXPIRATION ----------
  if (isValid && showAlert) return <ShowAlertActivation />;

  // ---------- MODAL D'ENTRÉE DE CLÉ ----------
  return (
    <Modal visible transparent animationType="fade">
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.6)",
        }}
      >
        <View
          style={{
            backgroundColor: "#1F2937",
            padding: 18,
            borderRadius: 10,
            width: "80%",
          }}
        >
          <Text style={{ color: "white", marginBottom: 12, fontSize: 18 }}>
            {`Entrez votre clé d'activation`}
          </Text>

          <TextInput
            placeholder="Clé"
            placeholderTextColor="#999"
            style={{
              backgroundColor: "#374151",
              color: "white",
              padding: 10,
              borderRadius: 6,
            }}
            value={key}
            onChangeText={setKey}
          />

          <TouchableOpacity
            style={{
              marginTop: 16,
              backgroundColor: Colors.dark.accent,
              padding: 10,
              borderRadius: 6,
            }}
            onPress={handleValidate}
          >
            <Text style={{ textAlign: "center", color: "white", fontSize: 16 }}>
              Valider
            </Text>
          </TouchableOpacity>

          <View style={{ marginTop: 20 }}>
            <Text style={{ color: Colors.dark.info, marginBottom: 6 }}>
              Assistance Bizo :
            </Text>
            <Text style={{ color: "white" }}>
              📞 Téléphone : {CONTACT_INFO.phone}
            </Text>
            <Text style={{ color: "white" }}>
              💬 WhatsApp : {CONTACT_INFO.whatsapp}
            </Text>
            <Text style={{ color: "white" }}>
              📧 Mail : {CONTACT_INFO.email}
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}
