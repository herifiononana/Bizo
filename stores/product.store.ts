import { Product } from "@/interface/product/product";
import { create } from "zustand";

interface ProductState {
  products?: Product[];
  isLoaded: boolean;
  setProducts: (products: Product[]) => void;
  setIsLoaded: (v: boolean) => void;
}

export const useProductsStore = create<ProductState>((set) => ({
  products: [],
  isLoaded: false,
  setProducts: (products: Product[]) => set({ products }),
  setIsLoaded: (isLoaded: boolean) => set({ isLoaded }),
}));
