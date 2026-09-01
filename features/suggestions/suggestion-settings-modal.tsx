import { CancelButton } from "@/components/cancel-button";
import { SaveButton } from "@/components/save-button";
import {
  SUGGESTION_FIELD_GROUPS,
  SuggestionFieldKey,
} from "@/constants/suggestion-fields";
import { useSuggestionSettings } from "@/hooks/suggestions/useSuggestionSettings";
import {
  DEFAULT_SUGGESTION_SETTINGS,
  SuggestionSettings,
} from "@/interface/suggestion";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const toValueStrings = (
  settings: SuggestionSettings
): Record<SuggestionFieldKey, string> => {
  const result = {} as Record<SuggestionFieldKey, string>;
  for (const group of SUGGESTION_FIELD_GROUPS) {
    for (const field of group.fields) {
      const raw = settings[field.key];
      result[field.key] = field.isPercent
        ? String(Math.round(raw * 1000) / 10)
        : String(raw);
    }
  }
  return result;
};

type Props = {
  visible: boolean;
  onClose: () => void;
};

const SuggestionSettingsModal = ({ visible, onClose }: Props) => {
  const { settings, updateSettings, resetSettings } = useSuggestionSettings();
  const [values, setValues] = useState<Record<SuggestionFieldKey, string>>(() =>
    toValueStrings(settings)
  );

  useEffect(() => {
    if (visible) setValues(toValueStrings(settings));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const handleChange = (key: SuggestionFieldKey, text: string) => {
    setValues((prev) => ({ ...prev, [key]: text }));
  };

  const handleSave = () => {
    const next: SuggestionSettings = { ...settings };
    for (const group of SUGGESTION_FIELD_GROUPS) {
      for (const field of group.fields) {
        const parsed = parseFloat(values[field.key].replace(",", "."));
        if (Number.isNaN(parsed)) continue;
        next[field.key] = field.isPercent ? parsed / 100 : parsed;
      }
    }
    updateSettings(next);
    onClose();
  };

  const handleReset = () => {
    Alert.alert(
      "Réinitialiser les réglages",
      "Remettre tous les seuils de l'assistant IA à leurs valeurs par défaut ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Réinitialiser",
          style: "destructive",
          onPress: () => {
            resetSettings();
            setValues(toValueStrings(DEFAULT_SUGGESTION_SETTINGS));
          },
        },
      ]
    );
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <StatusBar barStyle="light-content" backgroundColor="#0C1224" />

        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Réglages de l&apos;IA</Text>
            <Text style={styles.headerSubtitle}>
              Personnalisez les seuils utilisés pour les suggestions
            </Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={22} color="#F4F6FF" />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.body}
          showsVerticalScrollIndicator={false}
        >
          {SUGGESTION_FIELD_GROUPS.map((group) => (
            <View key={group.title} style={styles.section}>
              <Text style={styles.sectionTitle}>{group.title}</Text>
              {group.fields.map((field) => (
                <View key={field.key} style={styles.fieldRow}>
                  <Text style={styles.fieldLabel}>{field.label}</Text>
                  <View style={styles.fieldInputRow}>
                    <TextInput
                      style={styles.fieldInput}
                      keyboardType="decimal-pad"
                      value={values[field.key]}
                      onChangeText={(text) => handleChange(field.key, text)}
                    />
                    <Text style={styles.fieldUnit}>{field.unit}</Text>
                  </View>
                </View>
              ))}
            </View>
          ))}

          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Ionicons name="refresh" size={16} color="#F5B544" />
            <Text style={styles.resetText}>Réinitialiser les valeurs par défaut</Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.footer}>
          <SaveButton onPress={handleSave} />
          <CancelButton onPress={onClose} />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default SuggestionSettingsModal;

const styles = StyleSheet.create({
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

  body: {
    padding: 20,
    paddingBottom: 20,
  },

  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 13,
    color: "#7A83A2",
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 12,
  },

  fieldRow: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 13,
    color: "#B7BFD8",
    marginBottom: 6,
  },
  fieldInputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#141B33",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    paddingHorizontal: 14,
  },
  fieldInput: {
    flex: 1,
    height: 46,
    color: "#F4F6FF",
    fontSize: 15,
    fontWeight: "600",
  },
  fieldUnit: {
    fontSize: 12,
    color: "#545C7A",
    fontWeight: "600",
    marginLeft: 8,
  },

  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    marginTop: 4,
  },
  resetText: {
    color: "#F5B544",
    fontSize: 13,
    fontWeight: "700",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.06)",
  },
});
