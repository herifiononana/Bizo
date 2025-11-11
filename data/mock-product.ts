import { Product } from "@/interface/product/product";

export const mockProducts: Product[] = [
  {
    id: Date.now().toString(),
    name: "Riz 5kg",
    quantity: 20,
    purchasePrice: 5000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: (Date.now() + 1).toString(),
    name: "Huile 1L",
    quantity: 15,
    purchasePrice: 3000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: (Date.now() + 2).toString(),
    name: "Sucre 2kg",
    quantity: 10,
    purchasePrice: 2000,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: (Date.now() + 3).toString(),
    name: "Farine 1kg",
    quantity: 12,
    purchasePrice: 2500,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: (Date.now() + 4).toString(),
    name: "Savon",
    quantity: 30,
    purchasePrice: 1500,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
