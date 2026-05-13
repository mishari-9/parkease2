"use client";

import Link from "next/link";
import { useUserStore } from "@/store/userStore";
import { tc } from "@/lib/i18n";
import { ThemeToggle } from "@/components/ThemeToggle";

export function SiteHeader() {
  const lang = useUserStore((s) => s.user.language);
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/90">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 flex-col">
          <span className="text-lg font-extrabold tracking-tight text-pe-primary">
            {tc(lang, "brand")}
          </span>
          <span className="truncate text-[11px] font-medium text-slate-500 dark:text-slate-400">
            {tc(lang, "tagline")}
          </span>
        </Link>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
          <div className="sm:hidden">
            <ThemeToggle compact />
          </div>
          <Link
            href="/search"
            className="rounded-full bg-gradient-to-r from-pe-primary to-pe-accent px-4 py-2 text-xs font-bold text-white shadow-md transition hover:opacity-95"
          >
            {tc(lang, "search")}
          </Link>
        </div>
      </div>
    </header>
  );
}
