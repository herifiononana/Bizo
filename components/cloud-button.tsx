// components/CloudButtons.tsx
import { useCloudSync } from "@/hooks/useCloudSync";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CloudButtons() {
  const { signIn, backup, restore, userUid, loading } = useCloudSync();
  const [signed, setSigned] = useState<boolean>(!!userUid);

  return (
    <View style={styles.container}>
      {!signed ? (
        <TouchableOpacity
          style={styles.signButton}
          onPress={async () => {
            try {
              await signIn();
              setSigned(true);
              Alert.alert("Connecté", "Connecté avec succès à Google");
            } catch (e) {
              Alert.alert("Erreur", String(e));
            }
          }}
          disabled={loading}
        >
          <Text style={styles.signText}>Se connecter (Google)</Text>
        </TouchableOpacity>
      ) : (
        <>
          <TouchableOpacity
            style={styles.backupButton}
            onPress={async () => {
              try {
                await backup();
                Alert.alert("Backup", "Sauvegarde cloud réussie ✅");
              } catch (e) {
                Alert.alert("Erreur Backup", String(e));
              }
            }}
            disabled={loading}
          >
            <Text style={styles.btnText}>📤 Sauvegarder (Cloud)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.restoreButton}
            onPress={async () => {
              try {
                await restore();
                Alert.alert(
                  "Restauration",
                  "Données restaurées depuis le cloud ✅"
                );
              } catch (e) {
                Alert.alert("Erreur Restore", String(e));
              }
            }}
            disabled={loading}
          >
            <Text style={styles.btnText}>📥 Restaurer (Cloud)</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 12, alignItems: "center" },
  signButton: {
    backgroundColor: "#4285F4",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  signText: { color: "#fff", fontWeight: "700" },
  backupButton: {
    backgroundColor: "#047857",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
    marginBottom: 8,
  },
  restoreButton: {
    backgroundColor: "#0F172A",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  btnText: { color: "#fff", fontWeight: "700" },
});
