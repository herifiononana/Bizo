import { Activation } from "@/interface/Activation";
import { getActivation, saveActivation } from "@/services/activation";
import { useActivationStore } from "@/stores/activation.store";
import { useEffect } from "react";

export const useActivation = () => {
  const { activation, setActivation } = useActivationStore();

  const now = Date.now();

  // activation ----------
  const activate = async () => {
    const nowTs = Date.now();
    const newData: Activation = {
      activationDate: nowTs,
      lastRunTimestamp: nowTs,
      daysUsed: 0, // reset
    };
    setActivation(newData);
    await saveActivation(newData);
  };

  let updatedDays = !activation?.lastRunTimestamp
    ? 50
    : activation?.daysUsed ?? 0;

  // --------- 1) charger activation au démarrage ----------
  useEffect(() => {
    const load = async () => {
      try {
        const act = await getActivation();
        setActivation(act);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        setActivation({
          activationDate: 0,
          lastRunTimestamp: 0,
          daysUsed: 0,
        });
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --------- 2) calcul du delta ----------
  if (activation?.lastRunTimestamp) {
    const delta = (now - activation.lastRunTimestamp) / (1000 * 60 * 60 * 24);

    // changement d'heure en arrière => fraude
    if (delta < 0) {
      return { isValid: false, showAlert: false, activate };
    }

    // augmenter le compteur seulement si delta >= 1 minute
    if (delta > 1 / (24 * 60)) {
      updatedDays = activation.daysUsed + delta;

      const newData: Activation = {
        activationDate: activation.activationDate,
        lastRunTimestamp: now,
        daysUsed: updatedDays,
      };

      setActivation(newData);
      saveActivation(newData);
    }
  }

  // --------- 3) validité ----------
  // const isValid = updatedDays < 30;
  const isValid = updatedDays < 2; // pour test

  // --------- 4) showAlert si bloqué ----------
  const showAlert = updatedDays >= 2 || updatedDays === 1;

  return {
    isValid,
    showAlert,
    activate,
  };
};
