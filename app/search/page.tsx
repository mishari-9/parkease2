"use client";

import { Suspense, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { SiteHeader } from "@/components/SiteHeader";
import { SearchBar } from "@/components/SearchBar";
import { searchLots } from "@/data/mockLots";
import { useUserStore } from "@/store/userStore";
import { tc } from "@/lib/i18n";
import { MapPin, ChevronRight } from "lucide-react";

function SearchResults() {
  const params = useSearchParams();
  const q = params.get("q") ?? "";
  const lang = useUserStore((s) => s.user.language);
  const lots = useMemo(() => searchLots(q), [q]);

  return (
    <div className="mx-auto max-w-lg px-4 py-4 pb-28">
      <SearchBar initialQuery={q} />
      <p className="mt-4 text-sm text-slate-500">
        {lots.length} {lang === "ar" ? "نتيجة" : "results"}
        {q ? ` · “${q}”` : ""}
      </p>
      <ul className="mt-4 space-y-3">
        {lots.map((lot, i) => (
          <motion.li
            key={lot.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <Link
              href={`/lots/${lot.id}`}
              className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-card transition hover:border-pe-primary/30 hover:shadow-md"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-pe-light text-pe-primary">
                <MapPin className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-900">{lot.name}</p>
                <p className="truncate text-xs text-slate-500">{lot.address}</p>
                <p className="mt-1 text-xs font-medium text-pe-primary">
                  {lot.availableSlots} {tc(lang, "spots")} · SAR {lot.pricePerHour}/hr
                </p>
              </div>
              <ChevronRight className="h-5 w-5 shrink-0 text-slate-300 rtl:rotate-180" />
            </Link>
          </motion.li>
        ))}
      </ul>
      {lots.length === 0 && (
        <p className="mt-8 text-center text-slate-600">
          {lang === "ar" ? "لا نتائج — جرّب كلمات أخرى." : "No lots match. Try another keyword."}
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
          <div className="p-8 text-center text-slate-500">Loading…</div>
        }
      >
        <SearchResults />
      </Suspense>
    </>
  );
}
