/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

const orangeAccent = "#F97316";
const blueAccent = "#3B82F6";
const greenAccent = "#22C55E";
const redAccent = "#EF4444";
const cyanAccent = "#00D4FF";

export const Colors = {
  light: {
    text: "#11181C",
    background: "#FFFFFF",
    tint: "#F97316",
    icon: "#6B7280",
    tabIconDefault: "#6B7280",
    tabIconSelected: orangeAccent,

    primary: "#F3F4F6",
    accent: orangeAccent,
    success: greenAccent,
    danger: redAccent,
    info: blueAccent,
    cyan: cyanAccent,

    surface: "#F3F4F6",
    border: "#E5E7EB",
    shadow: "rgba(0,0,0,0.08)",
    card: "#FFFFFF",
  },

  dark: {
    text: "#FFFFFF",
    background: "#080C1F",
    tint: "#172049",
    icon: "#8891B3",
    tabIconDefault: "#8891B3",
    tabIconSelected: orangeAccent,

    primary: "#0F1535",
    accent: orangeAccent,
    success: greenAccent,
    danger: redAccent,
    info: blueAccent,
    cyan: cyanAccent,

    surface: "#0F1535",
    border: "rgba(255,255,255,0.10)",
    shadow: "rgba(0,212,255,0.08)",

    card: "#172049",
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
