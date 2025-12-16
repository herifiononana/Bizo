import { MAX_VALIDATION_DAY } from "@/constants/constants";
import { Activation } from "@/interface/Activation";
import { getActivation, saveActivation } from "@/services/activation";
import { useActivationStore } from "@/stores/activation.store";
import { useEffect, useState } from "react";

export const useActivation = () => {
  const { activation, setActivation } = useActivationStore();
  const [isMounted, setIsMounted] = useState<boolean>(false);

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

  // let updatedDays =
  //   !activation?.lastRunTimestamp && isMounted
  //     ? MAX_VALIDATION_DAY + 1
  //     : activation?.daysUsed ?? 0;
  let updatedDays = activation?.daysUsed ?? 0;

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

  useEffect(() => {
    if (!activation?.lastRunTimestamp) return;

    const delta =
      (Date.now() - activation.lastRunTimestamp) / (1000 * 60 * 60 * 24);

    if (delta < 0) return;

    if (delta > 1 / (24 * 60)) {
      const updated = activation.daysUsed + delta;

      const newData: Activation = {
        ...activation,
        daysUsed: updated,
        lastRunTimestamp: Date.now(),
      };

      setActivation(newData);
      saveActivation(newData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activation?.lastRunTimestamp]);

  // --------- 3) validité ----------
  const isValid = updatedDays <= MAX_VALIDATION_DAY;

  // --------- 4) showAlert si bloqué ----------
  const showAlert = activation?.daysUsed
    ? activation.daysUsed >= MAX_VALIDATION_DAY - 2 &&
      activation.daysUsed < MAX_VALIDATION_DAY
    : false;

  return {
    isValid,
    showAlert,
    activate,
  };
};
