"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserStore } from "@/store/userStore";
import { tc } from "@/lib/i18n";

type Props = {
  initialQuery?: string;
  compact?: boolean;
};

export function SearchBar({ initialQuery = "", compact }: Props) {
  const router = useRouter();
  const lang = useUserStore((s) => s.user.language);
  const [q, setQ] = useState(initialQuery);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const submit = useCallback(() => {
    const trimmed = q.trim();
    const params = new URLSearchParams();
    if (trimmed) params.set("q", trimmed);
    router.push(`/search?${params.toString()}`);
    setFiltersOpen(false);
  }, [q, router]);

  const suggestions = useMemo(() => {
    if (!q.trim()) return [] as string[];
    return ["KAFD", "Olaya", "Mall", "Boulevard", "DQ"].filter((s) =>
      s.toLowerCase().includes(q.trim().toLowerCase())
    );
  }, [q]);

  return (
    <div className={compact ? "" : "w-full max-w-xl"}>
      <div className="flex gap-2">
        <div className="relative flex flex-1 items-center">
          <Search className="pointer-events-none absolute start-3 h-5 w-5 text-pe-primary/60" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                submit();
              }
            }}
            placeholder={tc(lang, "searchPlaceholder")}
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white ps-11 pe-4 text-sm shadow-sm outline-none ring-pe-primary/30 transition focus:border-pe-primary focus:ring-2"
          />
        </div>
        <button
          type="button"
          onClick={() => setFiltersOpen((o) => !o)}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-pe-primary shadow-sm transition hover:bg-pe-light"
          aria-expanded={filtersOpen}
          aria-label={tc(lang, "filters")}
        >
          <SlidersHorizontal className="h-5 w-5" />
        </button>
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={submit}
          className="hidden h-12 shrink-0 rounded-2xl bg-pe-primary px-5 text-sm font-semibold text-white shadow-md sm:inline-block"
        >
          {tc(lang, "search")}
        </motion.button>
      </div>
      <button
        type="button"
        onClick={submit}
        className="mt-2 flex h-11 w-full items-center justify-center rounded-xl bg-pe-primary text-sm font-semibold text-white shadow sm:hidden"
      >
        {tc(lang, "search")}
      </button>

      <AnimatePresence>
        {filtersOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 overflow-hidden rounded-xl border border-slate-100 bg-pe-surface p-4 text-sm text-slate-600"
          >
            <p className="mb-2 font-medium text-slate-800">{tc(lang, "filters")}</p>
            <p>
              {lang === "ar"
                ? "للتجربة: استخدم شريط البحث للانتقال إلى نتائج حقيقية."
                : "Demo: use the search box — results link to real lot pages."}
            </p>
            <button
              type="button"
              className="mt-3 text-pe-primary underline"
              onClick={() => setFiltersOpen(false)}
            >
              {tc(lang, "apply")}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {suggestions.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              className="rounded-full bg-white px-3 py-1 text-xs font-medium text-pe-primary shadow-sm ring-1 ring-pe-primary/20"
              onClick={() => {
                setQ(s);
                router.push(`/search?q=${encodeURIComponent(s)}`);
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
