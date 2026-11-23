import { loadInvoice, shareInvoice } from "@/hooks/invoice/useInvoice";
import { Invoice, InvoiceFormat } from "@/interface/invoice/invoice";
import { Sale } from "@/interface/sale/sale";
import { renderInvoiceHtml } from "@/services/invoice/invoice-html";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview";

// Monté seulement quand l'aperçu est ouvert : l'état repart de zéro à chaque ouverture.
type InvoicePreviewModalProps = {
  sales: Sale[];
  onClose: () => void;
};

const FORMATS: { value: InvoiceFormat; label: string }[] = [
  { value: "a4", label: "A4" },
  { value: "ticket80", label: "Ticket 80 mm" },
];

const SHARE_ERRORS = {
  unavailable: "Le partage de fichiers n'est pas disponible sur cet appareil.",
  error: "Impossible de générer la facture.",
} as const;

const InvoicePreviewModal = ({ sales, onClose }: InvoicePreviewModalProps) => {
  const [format, setFormat] = useState<InvoiceFormat>("a4");
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [sharing, setSharing] = useState(false);

  // Recalculée à chaque ouverture : l'aperçu reflète toujours l'état courant des ventes.
  useEffect(() => {
    let cancelled = false;
    loadInvoice(sales).then((result) => {
      if (cancelled) return;
      if (!result) {
        onClose();
        Alert.alert(
          "Informations vendeur manquantes",
          "Renseignez le nom de la société et le téléphone depuis le tableau de bord (icône boutique)."
        );
        return;
      }
      setInvoice(result);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sales]);

  const html = useMemo(
    () => (invoice ? renderInvoiceHtml(invoice, format, true) : null),
    [invoice, format]
  );

  const handleShare = async () => {
    if (!invoice || sharing) return;
    setSharing(true);
    const result = await shareInvoice(invoice, format);
    setSharing(false);
    if (result !== "shared") Alert.alert("Erreur", SHARE_ERRORS[result]);
  };

  return (
    <Modal visible animationType="slide" onRequestClose={onClose}>
      <StatusBar barStyle="light-content" />
      <View style={styles.screen}>
        <View style={styles.header}>
          <Text style={styles.title}>Aperçu de la facture</Text>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <MaterialIcons name="close" size={20} color="#B7BFD8" />
          </TouchableOpacity>
        </View>

        <View style={styles.formats}>
          {FORMATS.map((f) => (
            <TouchableOpacity
              key={f.value}
              style={[styles.formatBtn, format === f.value && styles.formatBtnActive]}
              onPress={() => setFormat(f.value)}
            >
              <Text
                style={[styles.formatText, format === f.value && styles.formatTextActive]}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.preview}>
          {!html ? (
            <ActivityIndicator color="#F97316" style={styles.loader} />
          ) : (
            <WebView
              originWhitelist={["*"]}
              source={{ html }}
              style={styles.webview}
              scalesPageToFit
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>

        <TouchableOpacity
          style={[styles.shareBtn, (!invoice || sharing) && styles.shareBtnDisabled]}
          onPress={handleShare}
          disabled={!invoice || sharing}
        >
          <MaterialIcons name="share" size={18} color="#fff" />
          <Text style={styles.shareText}>
            {sharing ? "Génération du PDF…" : "Partager le PDF"}
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default InvoicePreviewModal;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#0C1224", paddingTop: 45, paddingBottom: 15 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    marginBottom: 9,
  },
  title: { fontSize: 18, fontWeight: "800", color: "#F4F6FF" },
  closeBtn: {
    padding: 5,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  formats: { flexDirection: "row", gap: 6, paddingHorizontal: 15, marginBottom: 9 },
  formatBtn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 9,
    borderRadius: 5,
    backgroundColor: "#1B2342",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  formatBtnActive: {
    backgroundColor: "rgba(249,115,22,0.15)",
    borderColor: "#F97316",
  },
  formatText: { color: "#B7BFD8", fontWeight: "700", fontSize: 14 },
  formatTextActive: { color: "#FB923C" },
  preview: {
    flex: 1,
    marginHorizontal: 15,
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  webview: { flex: 1, backgroundColor: "#fff" },
  loader: { flex: 1 },
  shareBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#F97316",
    borderRadius: 5,
    height: 50,
    marginHorizontal: 15,
    marginTop: 9,
  },
  shareBtnDisabled: { opacity: 0.5 },
  shareText: { color: "#fff", fontWeight: "800", fontSize: 15 },
});
