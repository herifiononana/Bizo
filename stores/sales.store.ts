import { Sale } from "@/interface/sale/sale";
import { create } from "zustand";

interface SalesStore {
  sales?: Sale[];
  isLoaded: boolean;
  setSales: (sales: Sale[]) => void;
  setIsLoaded: (v: boolean) => void;
}

export const useSalesStore = create<SalesStore>((set) => ({
  sales: [],
  isLoaded: false,
  setSales: (sales: Sale[]) => set({ sales }),
  setIsLoaded: (isLoaded: boolean) => set({ isLoaded }),
}));
