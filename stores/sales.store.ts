import { Sale } from "@/interface/sale/sale";
import { create } from "zustand";

interface SalesStore {
  sales?: Sale[];
  setSales: (sales: Sale[]) => void;
}

export const useSalesStore = create<SalesStore>((set) => ({
  sales: [],
  setSales: (sales: Sale[]) => {
    set({ sales: sales });
  },
}));
