"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { motion } from "framer-motion";
import { useThemeStore, type ThemePreference } from "@/store/themeStore";

const options: { value: ThemePreference; icon: typeof Sun; label: string }[] = [
  { value: "light", icon: Sun, label: "Light" },
  { value: "dark", icon: Moon, label: "Dark" },
  { value: "system", icon: Monitor, label: "Auto" },
];

export function ThemeToggle({ compact }: { compact?: boolean }) {
  const preference = useThemeStore((s) => s.preference);
  const setPreference = useThemeStore((s) => s.setPreference);

  if (compact) {
    const next: ThemePreference =
      preference === "light" ? "dark" : preference === "dark" ? "system" : "light";
    const Icon = preference === "light" ? Sun : preference === "dark" ? Moon : Monitor;
    return (
      <motion.button
        type="button"
        whileTap={{ scale: 0.92 }}
        onClick={() => setPreference(next)}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-amber-500 shadow-sm transition hover:border-pe-primary/40 dark:border-slate-600 dark:bg-slate-800 dark:text-amber-300"
        title={`Theme: ${preference}`}
        aria-label="Toggle color theme"
      >
        <Icon className="h-5 w-5" />
      </motion.button>
    );
  }

  return (
    <div
      className="flex rounded-full border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-600 dark:bg-slate-800"
      role="group"
      aria-label="Theme"
    >
      {options.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => setPreference(value)}
          className={`relative flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
            preference === value
              ? "bg-gradient-to-r from-pe-primary to-pe-accent text-white shadow-md"
              : "text-slate-500 hover:text-pe-primary dark:text-slate-400"
          }`}
        >
          <span className="relative z-10 flex items-center gap-1">
            <Icon className="h-3.5 w-3.5" />
            {label}
          </span>
        </button>
      ))}
    </div>
  );
}
