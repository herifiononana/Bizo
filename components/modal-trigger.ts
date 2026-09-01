import type { ReactNode } from "react";

// Permet à un composant modal auto-suffisant d'exposer un bouton d'ouverture personnalisable.
export type ModalTrigger = (opener: { onPress: () => void }) => ReactNode;
