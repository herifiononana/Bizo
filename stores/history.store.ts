import { Sale } from "@/interface/sale/sale";
import { create } from "zustand";

interface HistoryStore {
  history?: Sale[];
  setHistory: (sales: Sale[]) => void;
}

export const useHistoryStore = create<HistoryStore>((set) => ({
  history: [],
  setHistory: (sales: Sale[]) => {
    set({ history: sales });
  },
}));
