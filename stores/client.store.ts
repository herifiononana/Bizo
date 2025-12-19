import { Client } from "@/interface/client/client";
import { create } from "zustand";

interface ClientState {
  clients?: Client[];
  setClients: (client: Client[]) => void;
}

export const useClientsStore = create<ClientState>((set) => ({
  clients: [],
  setClients: (clients: Client[]) => {
    set({ clients });
  },
}));
