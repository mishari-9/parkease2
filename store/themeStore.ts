"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemePreference = "light" | "dark" | "system";
export type FontSize = "small" | "medium" | "large";

export function resolveTheme(pref: ThemePreference): "light" | "dark" {
  if (pref === "system") {
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return pref;
}

export function resolveFontSize(fs: FontSize): number {
  switch (fs) {
    case "small":
      return 14;
    case "medium":
      return 16;
    case "large":
      return 18;
  }
}

interface ThemeState {
  preference: ThemePreference;
  resolved: "light" | "dark";
  fontSize: FontSize;
  setPreference: (p: ThemePreference) => void;
  setFontSize: (s: FontSize) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      preference: "system",
      resolved: "light",
      fontSize: "medium",
      setPreference: (preference) =>
        set({ preference, resolved: resolveTheme(preference) }),
      setFontSize: (fontSize) => set({ fontSize }),
    }),
    {
      name: "parkease-theme",
      partialize: (s) => ({ preference: s.preference, fontSize: s.fontSize }),
      merge: (persisted, current) => {
        const p = (persisted as Partial<ThemeState>).preference ?? "system";
        const fs = (persisted as Partial<ThemeState>).fontSize ?? "medium";
        return {
          ...current,
          ...(persisted as object),
          preference: p,
          fontSize: fs,
          resolved: resolveTheme(p),
        };
      },
    },
  ),
);
