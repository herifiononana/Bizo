import { create } from "zustand";

interface HistorySecurityState {
  password: string | null;
  isLoaded: boolean;
  setPassword: (password: string | null) => void;
  setIsLoaded: (v: boolean) => void;
}

export const useHistorySecurityStore = create<HistorySecurityState>((set) => ({
  password: null,
  isLoaded: false,
  setPassword: (password: string | null) => set({ password }),
  setIsLoaded: (isLoaded: boolean) => set({ isLoaded }),
}));
