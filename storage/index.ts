import AsyncStorage from "@react-native-async-storage/async-storage";

// Sauvegarder des données
export const saveData = async (key: string, value: any) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Erreur sauvegarde AsyncStorage:", error);
  }
};

// Lire des données
export const getData = async (key: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error("Erreur lecture AsyncStorage:", error);
    return null;
  }
};

// Supprimer une clé
export const removeData = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error("Erreur suppression AsyncStorage:", error);
  }
};
