import { Reference } from "@/interface/reference";
import { create } from "zustand";

interface ReferenceState {
  references?: Reference[];
  setReferences: (references: Reference[]) => void;
}

export const useReferencesStore = create<ReferenceState>((set) => ({
  references: [],
  setReferences: (references: Reference[]) => {
    set({ references });
  },
}));
