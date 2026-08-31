import { DEFAULT_SUGGESTION_SETTINGS, SuggestionSettings } from "@/interface/suggestion";
import {
  getSuggestionSettings,
  saveSuggestionSettings,
} from "@/services/suggestions/settings";
import { useSuggestionSettingsStore } from "@/stores/suggestions.store";
import { useEffect } from "react";

export const useSuggestionSettings = () => {
  const settings = useSuggestionSettingsStore((state) => state.settings);
  const setSettings = useSuggestionSettingsStore((state) => state.setSettings);
  const isLoaded = useSuggestionSettingsStore((state) => state.isLoaded);
  const setIsLoaded = useSuggestionSettingsStore((state) => state.setIsLoaded);

  useEffect(() => {
    if (useSuggestionSettingsStore.getState().isLoaded) return;
    const loadSettings = async () => {
      const stored = await getSuggestionSettings();
      setSettings(stored);
      setIsLoaded(true);
    };
    loadSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateSettings = async (next: SuggestionSettings) => {
    setSettings(next);
    await saveSuggestionSettings(next);
  };

  const resetSettings = async () => {
    setSettings(DEFAULT_SUGGESTION_SETTINGS);
    await saveSuggestionSettings(DEFAULT_SUGGESTION_SETTINGS);
  };

  return { settings, isLoaded, updateSettings, resetSettings };
};
