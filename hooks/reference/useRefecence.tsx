import { Reference } from "@/interface/reference";
import { getReference, saveReference } from "@/services/reference";
import { saveProducts } from "@/services/product";
import { useProductsStore } from "@/stores/product.store";
import { useReferencesStore } from "@/stores/reference.store";
import { useEffect } from "react";
import { useDeleteProducts } from "../product/useDeleteProducts";
import { Alert } from "react-native";

export const useReference = () => {
  const references = useReferencesStore((state) => state.references);
  const setReferences = useReferencesStore((state) => state.setReferences);
  const setIsLoaded = useReferencesStore((state) => state.setIsLoaded);
  const products = useProductsStore((state) => state.products);
  const setProducts = useProductsStore((state) => state.setProducts);
  const { deleteProducts } = useDeleteProducts();

  useEffect(() => {
    if (useReferencesStore.getState().isLoaded) return;
    const loadReferences = async () => {
      const storedReferences = await getReference();
      if (storedReferences) setReferences(storedReferences);
      else {
        setReferences([]);
        await saveReference([]);
      }
      setIsLoaded(true);
    };
    loadReferences();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addReference = async (reference: Reference) => {
    const next = references ? [reference, ...references] : [reference];
    setReferences(next);
    await saveReference(next);
    Alert.alert("✅ Succès", "Référence ajouté avec succès !");
  };

  const updateReference = async (id: string, name: string) => {
    if (!references) return;
    const next = references.map((r) => (r.id === id ? { ...r, name } : r));
    setReferences(next);
    await saveReference(next);
  };

  /**
   * Supprime une référence.
   * `cascadeDeleteProducts` = true : les produits rattachés à cette référence
   * sont supprimés aussi ; `keepHistory` les archive (ventes et finances
   * conservées) au lieu de supprimer leurs ventes. false : les produits sont
   * conservés mais perdent leur référence (regroupés sous "Autres").
   */
  const deleteReference = async (
    id: string,
    cascadeDeleteProducts: boolean,
    keepHistory = true
  ) => {
    if (!references) return;

    const currentProducts = products ?? [];

    if (cascadeDeleteProducts) {
      const removedProductIds = new Set(
        currentProducts
          .filter((p) => p.referenceId === id)
          .map((p) => p.id)
      );
      await deleteProducts(removedProductIds, keepHistory);
    } else {
      const nextProducts = currentProducts.map((p) =>
        p.referenceId === id ? { ...p, referenceId: undefined } : p
      );
      setProducts(nextProducts);
      await saveProducts(nextProducts);
    }

    const nextReferences = references.filter((r) => r.id !== id);
    setReferences(nextReferences);
    await saveReference(nextReferences);
  };

  return {
    references,
    addReference,
    updateReference,
    deleteReference,
  };
};
