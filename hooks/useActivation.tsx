import { Activation } from "@/interface/Activation";
import { getActivation, saveActivation } from "@/services/activation";
import { useActivationStore } from "@/stores/activation.store";
import { useEffect } from "react";

export const useActivation = () => {
  const { activation, setActivation } = useActivationStore((state) => state);

  // obtenir timestamp actuel
  const now = Date.now();

  const isValid = activation ? activation.nextResetDate > now : false;

  const activate = async () => {
    const now = Date.now();
    const next = now + 30 * 24 * 60 * 60 * 1000; // 30 jours
    setActivation({
      activationDate: now,
      nextResetDate: next,
    });
    await saveActivation({
      activationDate: now,
      nextResetDate: next,
    });
  };

  const loadActivation = async () => {
    try {
      const response: Activation = await getActivation();
      setActivation({ ...response });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setActivation({ activationDate: 0, nextResetDate: 0 });
    }
  };

  useEffect(() => {
    loadActivation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isValid,
    activate,
  };
};
