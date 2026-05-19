import { Sale } from "@/interface/sale/sale";
import { create } from "zustand";

interface HistoryStore {
  storedHistory: Sale[];
  isLoaded: boolean;
  setStoredHistory: (sales: Sale[]) => void;
  setIsLoaded: (v: boolean) => void;
}

export const useHistoryStore = create<HistoryStore>((set) => ({
  storedHistory: [],
  isLoaded: false,
  setStoredHistory: (storedHistory: Sale[]) => set({ storedHistory }),
  setIsLoaded: (isLoaded: boolean) => set({ isLoaded }),
}));
