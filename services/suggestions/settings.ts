import { SUGGESTION_SETTINGS_KEY } from "@/constants/key-storage";
import {
  DEFAULT_SUGGESTION_SETTINGS,
  SuggestionSettings,
} from "@/interface/suggestion";
import { getData, saveData } from "@/storage";

export const getSuggestionSettings = async (): Promise<SuggestionSettings> => {
  const data = await getData(SUGGESTION_SETTINGS_KEY);
  // fusion avec les valeurs par défaut : garde la compat si de nouveaux réglages sont ajoutés plus tard
  return { ...DEFAULT_SUGGESTION_SETTINGS, ...(data ?? {}) };
};

export const saveSuggestionSettings = async (settings: SuggestionSettings) => {
  await saveData(SUGGESTION_SETTINGS_KEY, settings);
};
