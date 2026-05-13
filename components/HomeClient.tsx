"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Navigation, Sparkles } from "lucide-react";
import { ParkingMap } from "@/components/map/ParkingMap";
import { SearchBar } from "@/components/SearchBar";
import { MOCK_LOTS } from "@/data/mockLots";
import type { ParkingLot } from "@/types";
import { haversineDistance } from "@/lib/calculateDistance";
import { QASSIM_COLLEGE_OF_COMPUTER } from "@/lib/qassimCampus";
import { useUserStore } from "@/store/userStore";
import { tc } from "@/lib/i18n";
import { formatLotCategory } from "@/lib/formatLotCategory";
import { colors } from "@/constants/colors";

const CAMPUS = { lat: QASSIM_COLLEGE_OF_COMPUTER.lat, lng: QASSIM_COLLEGE_OF_COMPUTER.lng };

export function HomeClient() {
  const [selected, setSelected] = useState<ParkingLot | null>(null);
  const lang = useUserStore((s) => s.user.language);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6 pb-24 lg:pb-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pe-primary via-sky-600 to-indigo-700 px-6 py-8 text-white shadow-xl"
      >
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="relative flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              QU · College of Computer
            </p>
            <h2 className="mt-3 max-w-xl text-2xl font-extrabold tracking-tight sm:text-3xl">
              {tc(lang, "findParking")}
            </h2>
            <p className="mt-2 max-w-lg text-sm text-white/85">{tc(lang, "tapPin")}</p>
          </div>
          <div className="mt-4 w-full max-w-md lg:mt-0">
            <SearchBar compact />
          </div>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
        <div className="space-y-4 lg:col-span-7 xl:col-span-8">
          <ParkingMap
            lots={MOCK_LOTS}
            onSelectLot={setSelected}
            className="h-[min(52vh,420px)] min-h-[320px] lg:h-[min(72vh,680px)]"
          />
          <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-3 text-xs font-medium text-slate-600 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300">
            <span className="font-bold text-slate-800 dark:text-slate-100">{tc(lang, "mapLegend")}:</span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: colors.slotFree }} />
              {tc(lang, "legendGood")}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: colors.slotLow }} />
              {tc(lang, "legendWarn")}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: colors.slotFull }} />
              {tc(lang, "legendNone")}
            </span>
          </div>
        </div>

        <aside className="lg:col-span-5 xl:col-span-4">
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                className="fixed inset-x-4 bottom-[72px] z-40 max-h-[48vh] overflow-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-600 dark:bg-slate-900 lg:static lg:inset-auto lg:max-h-none lg:rounded-3xl lg:border-slate-200/80 lg:shadow-card"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold leading-snug text-slate-900 dark:text-white">
                      {selected.name}
                    </h3>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-pe-primary">
                      {selected.mapLabel}
                    </p>
                    <p className="mt-2 flex items-start gap-1 text-sm text-slate-600 dark:text-slate-300">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-pe-primary" />
                      {selected.address}
                    </p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {tc(lang, "lotType")}: {formatLotCategory(lang, selected.category)}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3 text-sm">
                      <div className="rounded-xl bg-pe-light px-3 py-2 dark:bg-slate-800">
                        <p className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">
                          {tc(lang, "sarHour")}
                        </p>
                        <p className="text-lg font-extrabold text-pe-primary">SAR {selected.pricePerHour}</p>
                      </div>
                      <div className="rounded-xl bg-emerald-50 px-3 py-2 dark:bg-emerald-950/40">
                        <p className="text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-300">
                          {tc(lang, "spots")}
                        </p>
                        <p className="text-lg font-extrabold text-emerald-800 dark:text-emerald-200">
                          {selected.availableSlots}/{selected.totalSlots}{" "}
                          <span className="text-xs font-semibold">
                            {selected.availableSlots === 0
                              ? tc(lang, "full")
                              : lang === "ar"
                                ? "متاح"
                                : "free"}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 dark:hover:bg-slate-800"
                    onClick={() => setSelected(null)}
                    aria-label="Close"
                  >
                    ×
                  </button>
                </div>
                <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                  <Link
                    href={`/lots/${selected.id}`}
                    className="inline-flex flex-1 items-center justify-center rounded-xl bg-gradient-to-r from-pe-primary to-pe-accent px-4 py-3 text-center text-sm font-bold text-white shadow-lg transition hover:opacity-95"
                  >
                    {tc(lang, "viewDetails")}
                  </Link>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${selected.location.lat},${selected.location.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-pe-primary/30 bg-white px-4 py-3 text-sm font-bold text-pe-primary dark:border-pe-primary/40 dark:bg-slate-900"
                  >
                    <Navigation className="h-4 w-4 rtl:rotate-180" />
                    {tc(lang, "navigate")}
                  </a>
                </div>
                <p className="mt-3 text-center text-[11px] text-slate-400 dark:text-slate-500">
                  {tc(lang, "distance")}:{" "}
                  {Math.round(haversineDistance(selected.location, CAMPUS))} m · CoC landmark
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hidden rounded-3xl border border-dashed border-slate-300/80 bg-white/60 p-8 text-center dark:border-slate-600 dark:bg-slate-900/40 lg:block"
              >
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{tc(lang, "tapPin")}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </aside>
      </div>
    </div>
  );
}
