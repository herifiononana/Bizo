import { Sale } from "@/interface/sale/sale";

export const mockSales: Sale[] = [
  {
    id: Date.now().toString(),
    productId: "1",
    quantity: 5,
    salePrice: 4000,
    totalAmount: 20000,
    saleDate: new Date("2025-11-01T10:15:00").toISOString(),
  },
  {
    id: (Date.now() + 1).toString(),
    productId: "2",
    quantity: 2,
    salePrice: 12000,
    totalAmount: 24000,
    saleDate: new Date("2025-11-03T14:45:00").toISOString(),
  },
  {
    id: (Date.now() + 2).toString(),
    productId: "3",
    quantity: 1,
    salePrice: 50000,
    totalAmount: 50000,
    saleDate: new Date("2025-11-05T09:30:00").toISOString(),
  },
  {
    id: (Date.now() + 3).toString(),
    productId: "1",
    quantity: 3,
    salePrice: 4000,
    totalAmount: 12000,
    saleDate: new Date("2025-11-08T16:00:00").toISOString(),
  },
  {
    id: (Date.now() + 4).toString(),
    productId: "2",
    quantity: 4,
    salePrice: 12000,
    totalAmount: 48000,
    saleDate: new Date("2025-11-10T11:00:00").toISOString(),
  },
];
