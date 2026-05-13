"use client";

import { useEffect } from "react";
import {
  useThemeStore,
  resolveTheme,
  resolveFontSize,
} from "@/store/themeStore";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const preference = useThemeStore((s) => s.preference);
  const fontSize = useThemeStore((s) => s.fontSize);

  useEffect(() => {
    const apply = () => {
      const r = resolveTheme(useThemeStore.getState().preference);
      useThemeStore.setState({ resolved: r });
      document.documentElement.classList.toggle("dark", r === "dark");
    };
    apply();
    if (preference !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [preference]);

  useEffect(() => {
    const px = resolveFontSize(fontSize);
    document.documentElement.style.setProperty("--user-font-size", `${px}px`);
  }, [fontSize]);

  return <>{children}</>;
}
