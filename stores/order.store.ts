import { Order } from "@/interface/order";
import { create } from "zustand";

interface OrdersState {
  orders?: Order[];
  setOrders: (orders: Order[]) => void;
}

export const useOrdersStore = create<OrdersState>((set) => ({
  orders: [],
  setOrders: (orders: Order[]) => {
    set({ orders });
  },
}));
