import { Product } from "@/interface/product/product";
import { create } from "zustand";

interface ProductState {
  products?: Product[];
  setProducts: (products: Product[]) => void;
}

export const useProductsStore = create<ProductState>((set) => ({
  products: [],
  setProducts: (products: Product[]) => {
    set({ products });
  },
}));
