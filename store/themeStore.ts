"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemePreference = "light" | "dark" | "system";

export function resolveTheme(pref: ThemePreference): "light" | "dark" {
  if (pref === "system") {
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return pref;
}

interface ThemeState {
  preference: ThemePreference;
  resolved: "light" | "dark";
  setPreference: (p: ThemePreference) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      preference: "system",
      resolved: "light",
      setPreference: (preference) =>
        set({ preference, resolved: resolveTheme(preference) }),
    }),
    {
      name: "parkease-theme",
      partialize: (s) => ({ preference: s.preference }),
      merge: (persisted, current) => {
        const p = (persisted as Partial<ThemeState>).preference ?? "system";
        return {
          ...current,
          ...(persisted as object),
          preference: p,
          resolved: resolveTheme(p),
        };
      },
    }
  )
);
