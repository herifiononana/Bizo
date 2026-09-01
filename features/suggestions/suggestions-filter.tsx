import { OTHER_REFERENCE } from "@/constants/constants";
import { useReference } from "@/hooks/reference/useRefecence";
import {
  SUGGESTION_TYPE_LABELS,
  SuggestionFilters,
  SuggestionType,
  getDefaultSuggestionFilters,
} from "@/interface/suggestion";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

type ChipOption<T> = { value: T; label: string };

function ChipsRow<T>({
  options,
  selected,
  onSelect,
}: {
  options: ChipOption<T>[];
  selected: T;
  onSelect: (value: T) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.chipsRow}
    >
      {options.map((opt) => (
        <TouchableOpacity
          key={String(opt.value)}
          style={[styles.chip, selected === opt.value && styles.chipActive]}
          onPress={() => onSelect(opt.value)}
        >
          <Text
            style={[styles.chipText, selected === opt.value && styles.chipTextActive]}
          >
            {opt.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const formatDate = (date: Date) =>
  date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });

const TYPE_OPTIONS: ChipOption<SuggestionType | null>[] = [
  { value: null, label: "Tous types" },
  ...(Object.keys(SUGGESTION_TYPE_LABELS) as SuggestionType[]).map((type) => ({
    value: type,
    label: SUGGESTION_TYPE_LABELS[type],
  })),
];

type Props = {
  value: SuggestionFilters;
  onChange: (next: SuggestionFilters) => void;
};

const SuggestionsFilter = ({ value, onChange }: Props) => {
  const { references } = useReference();
  const [startPickerVisible, setStartPickerVisible] = useState(false);
  const [endPickerVisible, setEndPickerVisible] = useState(false);

  const referenceOptions: ChipOption<string | null>[] = [
    { value: null, label: "Toutes références" },
    ...(references ?? []).map((r) => ({ value: r.id, label: r.name })),
    { value: OTHER_REFERENCE, label: "Autres" },
  ];

  const hasActiveFilters =
    !!value.startDate || !!value.endDate || !!value.referenceId || !!value.type;

  return (
    <View style={styles.container}>
      <View style={styles.dateRow}>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setStartPickerVisible(true)}
        >
          <MaterialIcons name="event" size={14} color="#7A83A2" />
          <Text style={styles.dateButtonText}>
            {value.startDate ? formatDate(value.startDate) : "Date début"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setEndPickerVisible(true)}
        >
          <MaterialIcons name="event" size={14} color="#7A83A2" />
          <Text style={styles.dateButtonText}>
            {value.endDate ? formatDate(value.endDate) : "Date fin"}
          </Text>
        </TouchableOpacity>
        {hasActiveFilters && (
          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => onChange(getDefaultSuggestionFilters())}
          >
            <Ionicons name="close-circle" size={22} color="#7A83A2" />
          </TouchableOpacity>
        )}
      </View>

      <ChipsRow
        options={referenceOptions}
        selected={value.referenceId}
        onSelect={(referenceId) => onChange({ ...value, referenceId })}
      />
      <ChipsRow
        options={TYPE_OPTIONS}
        selected={value.type}
        onSelect={(type) => onChange({ ...value, type })}
      />

      <DateTimePickerModal
        isVisible={startPickerVisible}
        mode="date"
        onConfirm={(date) => {
          setStartPickerVisible(false);
          onChange({ ...value, startDate: date });
        }}
        onCancel={() => setStartPickerVisible(false)}
      />
      <DateTimePickerModal
        isVisible={endPickerVisible}
        mode="date"
        onConfirm={(date) => {
          setEndPickerVisible(false);
          onChange({ ...value, endDate: date });
        }}
        onCancel={() => setEndPickerVisible(false)}
      />
    </View>
  );
};

export default SuggestionsFilter;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 14,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  dateButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1B2342",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    height: 44,
    paddingHorizontal: 12,
    gap: 6,
  },
  dateButtonText: {
    fontSize: 13,
    color: "#B7BFD8",
    fontWeight: "600",
  },
  resetButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  chipsRow: {
    paddingBottom: 10,
    gap: 8,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: "#1B2342",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
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
});
