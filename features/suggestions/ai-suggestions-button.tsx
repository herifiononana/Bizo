import Skeleton from "@/components/skeleton";
import { useSuggestions } from "@/hooks/suggestions/useSuggestions";
import { Suggestion, SuggestionSeverity } from "@/interface/suggestion";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const SEVERITY_STYLE: Record<
  SuggestionSeverity,
  { color: string; bg: string; label: string; icon: keyof typeof Ionicons.glyphMap }
> = {
  high: {
    color: "#F43F5E",
    bg: "rgba(244,63,94,0.14)",
    label: "Urgent",
    icon: "alert-circle",
  },
  medium: {
    color: "#F5B544",
    bg: "rgba(245,181,68,0.14)",
    label: "À surveiller",
    icon: "warning",
  },
  low: {
    color: "#3B82F6",
    bg: "rgba(59,130,246,0.14)",
    label: "Info",
    icon: "information-circle",
  },
};

const SEVERITY_ORDER: SuggestionSeverity[] = ["high", "medium", "low"];

const SKELETON_ROWS = 5;

const AiSuggestionsButton = () => {
  const [open, setOpen] = useState(false);
  const { suggestions, analyzing, analyze } = useSuggestions();

  const handleOpen = () => {
    setOpen(true);
    analyze();
  };

  const groupedSuggestions = useMemo(() => {
    const groups: Record<SuggestionSeverity, Suggestion[]> = {
      high: [],
      medium: [],
      low: [],
    };
    for (const s of suggestions) groups[s.severity].push(s);
    return SEVERITY_ORDER.map((severity) => ({
      severity,
      items: groups[severity],
    })).filter((group) => group.items.length > 0);
  }, [suggestions]);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.iconButton} onPress={handleOpen}>
        <MaterialCommunityIcons name="robot-outline" size={22} color="#FFF" />
      </TouchableOpacity>

      <Modal visible={open} animationType="slide" onRequestClose={() => setOpen(false)}>
        <View style={styles.screen}>
          <StatusBar barStyle="light-content" backgroundColor="#0C1224" />

          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>Assistant IA</Text>
              <Text style={styles.headerSubtitle}>
                {analyzing
                  ? "Analyse des données en cours…"
                  : suggestions.length === 0
                  ? "Rien à signaler"
                  : `${suggestions.length} suggestion${suggestions.length > 1 ? "s" : ""}`}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setOpen(false)}
            >
              <Ionicons name="close" size={22} color="#F4F6FF" />
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.body}
            showsVerticalScrollIndicator={false}
          >
            {analyzing ? (
              Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                <View key={i} style={styles.card}>
                  <Skeleton width={90} height={18} radius={999} />
                  <Skeleton width="80%" height={16} />
                  <Skeleton width="60%" height={14} />
                </View>
              ))
            ) : suggestions.length === 0 ? (
              <View style={styles.emptyState}>
                <MaterialCommunityIcons
                  name="robot-happy-outline"
                  size={48}
                  color="#545C7A"
                />
                <Text style={styles.emptyText}>
                  Rien à signaler pour le moment. Tout semble sain.
                </Text>
              </View>
            ) : (
              groupedSuggestions.map(({ severity, items }) => {
                const severityStyle = SEVERITY_STYLE[severity];
                return (
                  <View key={severity} style={styles.section}>
                    <View style={styles.sectionHeader}>
                      <View
                        style={[
                          styles.sectionIcon,
                          { backgroundColor: severityStyle.bg },
                        ]}
                      >
                        <Ionicons
                          name={severityStyle.icon}
                          size={16}
                          color={severityStyle.color}
                        />
                      </View>
                      <Text style={styles.sectionTitle}>{severityStyle.label}</Text>
                      <View
                        style={[styles.countChip, { backgroundColor: severityStyle.bg }]}
                      >
                        <Text style={[styles.countChipText, { color: severityStyle.color }]}>
                          {items.length}
                        </Text>
                      </View>
                    </View>

                    {items.map((s) => (
                      <View
                        key={s.id}
                        style={[styles.card, { borderLeftColor: severityStyle.color }]}
                      >
                        <Text style={styles.cardTitle}>{s.title}</Text>
                        <Text style={styles.cardMessage}>{s.message}</Text>
                      </View>
                    ))}
                  </View>
                );
              })
            )}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

export default AiSuggestionsButton;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 260,
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
    paddingBottom: 60,
  },

  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 10,
  },
  sectionIcon: {
    width: 28,
    height: 28,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    color: "#F4F6FF",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  countChip: {
    minWidth: 24,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    alignItems: "center",
  },
  countChipText: {
    fontSize: 12,
    fontWeight: "700",
  },

  card: {
    backgroundColor: "#141B33",
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    borderLeftWidth: 4,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#F4F6FF",
    marginBottom: 4,
  },
  cardMessage: {
    fontSize: 13,
    color: "#B7BFD8",
    lineHeight: 19,
  },

  emptyState: {
    alignItems: "center",
    paddingTop: 80,
    gap: 12,
  },
  emptyText: {
    color: "#7A83A2",
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 40,
  },
});
