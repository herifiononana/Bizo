export type Civility = "Monsieur" | "Madame";

export interface Client {
  id: string;
  civility: Civility;
  name: string;
  phone: string;
  email?: string;
  address: string;
  createdAt?: string; // ISO date
  updatedAt?: string;
}

// todo : delete this mock
export const MOCK_CLIENTS: Client[] = [
  {
    id: "clt-001",
    civility: "Monsieur",
    name: "Rakoto Jean",
    phone: "0341234567",
    email: "jean.rakoto@gmail.com",
    address: "Antananarivo, Analakely",
    createdAt: "2024-12-01T08:30:00.000Z",
  },
  {
    id: "clt-002",
    civility: "Madame",
    name: "Rasoanaivo Marie",
    phone: "0329876543",
    email: "marie.rasoanaivo@yahoo.com",
    address: "Antananarivo, Itaosy",
    createdAt: "2024-12-02T10:15:00.000Z",
  },
  {
    id: "clt-003",
    civility: "Monsieur",
    name: "Andrianina Paul",
    phone: "0334567890",
    address: "Antsirabe, Centre-ville",
    createdAt: "2024-12-03T14:00:00.000Z",
  },
  {
    id: "clt-004",
    civility: "Madame",
    name: "Randriamampianina Sophie",
    phone: "0347654321",
    email: "sophie.randriam@gmail.com",
    address: "Fianarantsoa",
    createdAt: "2024-12-04T09:45:00.000Z",
  },
  {
    id: "clt-005",
    civility: "Monsieur",
    name: "Razanamparany Hery",
    phone: "0321122334",
    address: "Toamasina, Tanambao",
    createdAt: "2024-12-05T16:20:00.000Z",
  },
  {
    id: "clt-006",
    civility: "Madame",
    name: "Rakotomalala Voahirana",
    phone: "0339988776",
    email: "voahirana.r@gmail.com",
    address: "Mahajanga",
    createdAt: "2024-12-06T11:10:00.000Z",
  },
];
