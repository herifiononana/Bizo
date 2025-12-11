import { Activation } from "@/interface/Activation";
import { create } from "zustand";

interface ActivationState {
  activation?: Activation;
  setActivation: (activation: Activation) => void;
}

export const useActivationStore = create<ActivationState>((set) => ({
  activation: { activationDate: 0, daysUsed: 0, lastRunTimestamp: 0 },
  setActivation: (activation: Activation) => {
    set({ activation });
  },
}));
