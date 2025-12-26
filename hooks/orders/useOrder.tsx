import { getOrders, saveOrders } from "@/services/order";
import { useOrdersStore } from "@/stores/order.store";
import { useEffect, useState } from "react";

export const useOrders = () => {
  const { orders, setOrders } = useOrdersStore();
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const storedOrders = await getOrders();
      if (storedOrders) {
        setOrders(storedOrders);
      } else {
        setOrders([]);
        await saveOrders([]);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setOrders([]); // fallback sécurisé
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    orders,
    loadOrders,
    loading, // 👈 important !!
  };
};
