import { useHistorySecurity } from "@/hooks/history/useHistorySecurity";
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

// Affiche le mot de passe de suppression après saisie du mot clé de l'app.
const RevealPasswordSection = () => {
  const { revealPassword } = useHistorySecurity();

  const [isOpen, setIsOpen] = useState(false);
  const [appKeyword, setAppKeyword] = useState("");
  const [revealedPassword, setRevealedPassword] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleReveal = () => {
    const password = revealPassword(appKeyword);
    if (password === null) {
      setErrorMessage("Mot clé incorrect.");
      setRevealedPassword(null);
      return;
    }
    setErrorMessage(null);
    setRevealedPassword(password);
  };

  const handleHide = () => {
    setRevealedPassword(null);
    setAppKeyword("");
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <TouchableOpacity onPress={() => setIsOpen(true)}>
        <Text style={styles.link}>Mot de passe oublié ?</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.box}>
      {revealedPassword === null ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Mot clé de l'app"
            placeholderTextColor="#7A83A2"
            secureTextEntry
            value={appKeyword}
            onChangeText={setAppKeyword}
          />
          {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
          <TouchableOpacity style={styles.revealButton} onPress={handleReveal}>
            <Text style={styles.revealButtonText}>Afficher le mot de passe</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.label}>Mot de passe actuel</Text>
          <Text selectable style={styles.password}>
            {revealedPassword}
          </Text>
        </>
      )}
      <TouchableOpacity onPress={handleHide}>
        <Text style={styles.link}>
          {revealedPassword === null ? "Annuler" : "Masquer"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default RevealPasswordSection;

const styles = StyleSheet.create({
  link: {
    color: "#3B82F6",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 3,
    marginBottom: 6,
  },
  box: {
    marginTop: 3,
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#1B2342",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    padding: 11,
    height: 50,
    color: "#F4F6FF",
    fontSize: 15,
    marginBottom: 6,
  },
  errorText: {
    color: "#F43F5E",
    fontSize: 13,
    marginBottom: 6,
  },
  revealButton: {
    backgroundColor: "#1B2342",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    paddingVertical: 9,
    alignItems: "center",
  },
  revealButtonText: {
    color: "#F4F6FF",
    fontSize: 14,
    fontWeight: "700",
  },
  label: {
    color: "#7A83A2",
    fontSize: 12,
    marginBottom: 3,
  },
  password: {
    color: "#F4F6FF",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 3,
  },
});
