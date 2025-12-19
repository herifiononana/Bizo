import { CLIENTS_KEY } from "@/constants/key-storage";
import { Client } from "@/interface/client/client";
import { getData, saveData } from "@/storage";

export const getClient = async () => {
  const data = await getData(CLIENTS_KEY);

  const clients: Client[] =
    data?.map((c: any) => {
      let response: Client;
      response = {
        ...c,
      };
      return response;
    }) ?? [];

  return clients;
};

export const saveClients = async (data: Client[]) => {
  await saveData(CLIENTS_KEY, data);
};

export const updateLocalClient = async (
  data: Client[],
  updatedProduct: Client
) => {
  return data.map((p) => (p.id === updatedProduct.id ? updatedProduct : p));
};
