/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

const primaryColor = "#1F2937"; // Couleur principale
const orangeAccent = "#F97316"; // Accent orange
const blueAccent = "#3B82F6";
const greenAccent = "#22C55E";
const redAccent = "#EF4444";

export const Colors = {
  light: {
    text: "#11181C",
    background: "#FFFFFF",
    tint: primaryColor,
    icon: "#6B7280",
    tabIconDefault: "#6B7280",
    tabIconSelected: orangeAccent,

    primary: primaryColor,
    accent: orangeAccent,
    success: greenAccent,
    danger: redAccent,
    info: blueAccent,

    surface: "#F3F4F6", // gris très clair
    border: "#E5E7EB", // gris clair neutre
    shadow: "rgba(0,0,0,0.08)", // ombre discrète
  },

  dark: {
    text: "#ECEDEE",
    background: "#111827",
    tint: primaryColor,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: orangeAccent,

    primary: primaryColor,
    accent: orangeAccent,
    success: greenAccent,
    danger: redAccent,
    info: blueAccent,

    surface: "#1F2937", // surface sombre
    border: "#374151", // gris foncé neutre
    shadow: "rgba(0,0,0,0.5)", // ombre plus prononcée

    card: "#000", // carte sombre
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
