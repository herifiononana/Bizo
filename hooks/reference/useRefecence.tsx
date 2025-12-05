// hooks/useProducts.ts
import { Reference } from "@/interface/reference";
import { getReference, saveReference } from "@/services/reference";
import { useReferencesStore } from "@/stores/reference.store";
import { useEffect } from "react";
import { Alert } from "react-native";

export const useReference = () => {
  const { references, setReferences } = useReferencesStore();

  // Charger au montage
  useEffect(() => {
    const loadReferences = async () => {
      const storedReferences = await getReference();
      if (storedReferences) setReferences(storedReferences);
      else {
        setReferences([]);
        await saveReference([]);
      }
    };
    loadReferences();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Ajouter une reference
  const addReference = async (reference: Reference) => {
    const next = references ? [reference, ...references] : [reference];
    setReferences(next);
    await saveReference(next);
    Alert.alert("✅ Succès", "Référence ajouté avec succès !");
  };

  return {
    references,
    addReference,
  };
};
