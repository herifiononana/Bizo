// hooks/useProducts.ts
import { REFERENCE_KEY } from "@/constants/key-storage";
import { Reference } from "@/interface/reference";
import { getData, saveData } from "@/storage";
import { useReferencesStore } from "@/stores/reference.store";
import { useEffect } from "react";
import { Alert } from "react-native";

export const useReference = () => {
  const { references, setReferences } = useReferencesStore();

  // Charger au montage
  useEffect(() => {
    const loadReferences = async () => {
      const storedReferences = await getData(REFERENCE_KEY);
      if (storedReferences) setReferences(storedReferences);
      else {
        setReferences([]);
        await saveData(REFERENCE_KEY, []);
      }
    };
    loadReferences();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Ajouter une reference
  const addReference = async (reference: Reference) => {
    const next = references ? [reference, ...references] : [reference];
    setReferences(next);
    await saveData(REFERENCE_KEY, next);
    Alert.alert("✅ Succès", "Référence ajouté avec succès !");
  };

  return {
    references,
    addReference,
  };
};
