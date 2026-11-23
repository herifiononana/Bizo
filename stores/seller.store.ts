import { SellerInfo } from "@/interface/invoice/invoice";
import { create } from "zustand";

interface SellerState {
  seller: SellerInfo | null;
  isLoaded: boolean;
  setSeller: (seller: SellerInfo | null) => void;
  setIsLoaded: (v: boolean) => void;
}

export const useSellerStore = create<SellerState>((set) => ({
  seller: null,
  isLoaded: false,
  setSeller: (seller) => set({ seller }),
  setIsLoaded: (isLoaded) => set({ isLoaded }),
}));
