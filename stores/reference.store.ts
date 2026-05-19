import { Reference } from "@/interface/reference";
import { create } from "zustand";

interface ReferenceState {
  references?: Reference[];
  isLoaded: boolean;
  setReferences: (references: Reference[]) => void;
  setIsLoaded: (v: boolean) => void;
}

export const useReferencesStore = create<ReferenceState>((set) => ({
  references: [],
  isLoaded: false,
  setReferences: (references: Reference[]) => set({ references }),
  setIsLoaded: (isLoaded: boolean) => set({ isLoaded }),
}));
