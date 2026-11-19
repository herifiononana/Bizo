import { Product } from "@/interface/product/product";
import { create } from "zustand";

interface ArchivedProductsState {
  archivedProducts: Product[];
  isLoaded: boolean;
  setArchivedProducts: (products: Product[]) => void;
  setIsLoaded: (isLoaded: boolean) => void;
}

export const useArchivedProductsStore = create<ArchivedProductsState>(
  (set) => ({
    archivedProducts: [],
    isLoaded: false,
    setArchivedProducts: (archivedProducts) => set({ archivedProducts }),
    setIsLoaded: (isLoaded) => set({ isLoaded }),
  })
);
