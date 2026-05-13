"use client";

import Link from "next/link";
import { useUserStore } from "@/store/userStore";
import { tc } from "@/lib/i18n";

export function SiteHeader() {
  const lang = useUserStore((s) => s.user.language);
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
        <Link href="/" className="flex flex-col">
          <span className="text-lg font-bold tracking-tight text-pe-primary">
            {tc(lang, "brand")}
          </span>
          <span className="text-[11px] text-slate-500">{tc(lang, "tagline")}</span>
        </Link>
        <Link
          href="/search"
          className="rounded-full bg-pe-light px-4 py-2 text-xs font-semibold text-pe-primary transition hover:bg-pe-primary hover:text-white"
        >
          {tc(lang, "search")}
        </Link>
      </div>
    </header>
  );
}
