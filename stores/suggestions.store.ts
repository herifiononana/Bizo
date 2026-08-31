import {
  DEFAULT_SUGGESTION_SETTINGS,
  SuggestionSettings,
} from "@/interface/suggestion";
import { create } from "zustand";

interface SuggestionSettingsState {
  settings: SuggestionSettings;
  isLoaded: boolean;
  setSettings: (settings: SuggestionSettings) => void;
  setIsLoaded: (v: boolean) => void;
}

export const useSuggestionSettingsStore = create<SuggestionSettingsState>(
  (set) => ({
    settings: DEFAULT_SUGGESTION_SETTINGS,
    isLoaded: false,
    setSettings: (settings: SuggestionSettings) => set({ settings }),
    setIsLoaded: (isLoaded: boolean) => set({ isLoaded }),
  })
);
