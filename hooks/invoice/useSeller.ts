import { SellerInfo } from "@/interface/invoice/invoice";
import { getSellerInfo, saveSellerInfo } from "@/services/invoice/seller";
import { useSellerStore } from "@/stores/seller.store";
import { useEffect } from "react";

export const useSeller = () => {
  const seller = useSellerStore((s) => s.seller);
  const isLoaded = useSellerStore((s) => s.isLoaded);
  const setSeller = useSellerStore((s) => s.setSeller);
  const setIsLoaded = useSellerStore((s) => s.setIsLoaded);

  useEffect(() => {
    if (useSellerStore.getState().isLoaded) return;
    getSellerInfo().then((stored) => {
      setSeller(stored);
      setIsLoaded(true);
    });
  }, [setSeller, setIsLoaded]);

  const updateSeller = async (info: SellerInfo) => {
    setSeller(info);
    await saveSellerInfo(info);
  };

  return { seller, isLoaded, updateSeller };
};
