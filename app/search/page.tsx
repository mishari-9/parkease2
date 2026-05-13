"use client";

import { Suspense, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { SiteHeader } from "@/components/SiteHeader";
import { SearchBar } from "@/components/SearchBar";
import { searchLots } from "@/data/mockLots";
import { useUserStore } from "@/store/userStore";
import { formatLotCategory } from "@/lib/formatLotCategory";
import { ChevronRight, MapPinned } from "lucide-react";

function SearchResults() {
  const params = useSearchParams();
  const q = params.get("q") ?? "";
  const lang = useUserStore((s) => s.user.language);
  const lots = useMemo(() => searchLots(q), [q]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-4 pb-28 sm:px-6 lg:px-8 lg:pb-10">
      <SearchBar initialQuery={q} />
      <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
        {lots.length} {lang === "ar" ? "نتيجة حول كلية الحاسب" : "lots around College of Computer"}
        {q ? ` · “${q}”` : ""}
      </p>
      <ul className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {lots.map((lot, i) => (
          <motion.li
            key={lot.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <Link
              href={`/lots/${lot.id}`}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card transition hover:-translate-y-0.5 hover:border-pe-primary/35 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900"
            >
              <div className="relative aspect-[16/10] w-full bg-slate-100 dark:bg-slate-800">
                <Image
                  src={
                    lot.photoUrls[0] ??
                    "https://images.unsplash.com/photo-1506521781263-d8422e82f57a?auto=format&fit=crop&w=1600&q=90"
                  }
                  alt={lot.name}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width:640px) 100vw, (max-width:1280px) 50vw, 33vw"
                  priority={i < 3}
                />
                <div className="absolute start-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-pe-primary shadow dark:bg-slate-900/90">
                  SAR {lot.pricePerHour}/hr
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-1 p-4">
                <p className="line-clamp-2 font-bold leading-snug text-slate-900 dark:text-white">{lot.name}</p>
                <p className="line-clamp-2 text-xs text-slate-500 dark:text-slate-400">{lot.address}</p>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-pe-primary">
                  {lot.mapLabel ?? formatLotCategory(lang, lot.category)}
                </p>
                <div className="mt-auto flex items-center justify-between pt-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                  <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                    <MapPinned className="h-4 w-4" />
                    {lot.availableSlots}/{lot.totalSlots} {lang === "ar" ? "متاح" : "free"}
                  </span>
                  <ChevronRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-0.5 rtl:rotate-180 dark:text-slate-500" />
                </div>
              </div>
            </Link>
          </motion.li>
        ))}
      </ul>
      {lots.length === 0 && (
        <p className="mt-8 text-center text-slate-600 dark:text-slate-300">
          {lang === "ar"
            ? "لا نتائج — جرّب: زوار، موقف، كلية الحاسب، جامعة القصيم."
            : "No match. Try: visitor, garage, Qassim, College of Computer."}
        </p>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <>
      <SiteHeader />
      <Suspense
        fallback={
          <div className="p-8 text-center text-slate-500 dark:text-slate-400">Loading…</div>
        }
      >
        <SearchResults />
      </Suspense>
    </>
  );
}
