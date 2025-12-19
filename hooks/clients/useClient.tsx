import { Client } from "@/interface/client/client";
import { getClient, saveClients } from "@/services/client";
import { useClientsStore } from "@/stores/client.store";
import { useEffect, useState } from "react";

export const useClients = () => {
  const { clients, setClients } = useClientsStore();
  const [loading, setLoading] = useState<boolean>(true);

  const loadClients = async () => {
    setLoading(true);
    try {
      const storedClients = await getClient();
      if (storedClients) {
        setClients(storedClients);
      } else {
        setClients([]);
        await saveClients([]);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setClients([]); // fallback sécurisé
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addClient = async (client: Client) => {
    const next = clients ? [...clients, client] : [client];
    setClients(next);
    await saveClients(next);
  };

  return {
    clients,
    addClient,
    loadClients,
    loading,
  };
};
