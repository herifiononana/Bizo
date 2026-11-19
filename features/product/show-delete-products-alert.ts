import { Alert } from "react-native";

type ShowDeleteProductsAlertParams = {
  title: string;
  message: string;
  onChoose: (keepHistory: boolean) => void;
};

// Choix commun aux suppressions de produits : conserver l'historique est l'option par défaut.
export const showDeleteProductsAlert = ({
  title,
  message,
  onChoose,
}: ShowDeleteProductsAlertParams) => {
  Alert.alert(
    title,
    `${message}\n\n• Conserver l'historique : les ventes et finances restent.\n• Tout supprimer : les ventes liées sont supprimées aussi.`,
    [
      { text: "Annuler", style: "cancel" },
      {
        text: "Tout supprimer",
        style: "destructive",
        onPress: () => onChoose(false),
      },
      { text: "Conserver l'historique", onPress: () => onChoose(true) },
    ]
  );
};
