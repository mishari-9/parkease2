"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Navigation } from "lucide-react";
import { ParkingMap } from "@/components/map/ParkingMap";
import { SearchBar } from "@/components/SearchBar";
import { MOCK_LOTS } from "@/data/mockLots";
import type { ParkingLot } from "@/types";
import { formatDistance } from "@/lib/calculateDistance";
import { useUserStore } from "@/store/userStore";
import { tc } from "@/lib/i18n";

const CENTER = { lat: 24.7136, lng: 46.6753 };

export function HomeClient() {
  const [selected, setSelected] = useState<ParkingLot | null>(null);
  const lang = useUserStore((s) => s.user.language);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 pb-24">
      <div className="rounded-2xl bg-gradient-to-br from-pe-primary to-pe-accent px-5 py-6 text-white shadow-lg">
        <p className="text-sm font-medium text-white/90">{tc(lang, "tagline")}</p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight">{tc(lang, "findParking")}</h2>
        <div className="mt-4">
          <SearchBar compact />
        </div>
      </div>

      <ParkingMap lots={MOCK_LOTS} onSelectLot={setSelected} />

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            className="fixed inset-x-4 bottom-[72px] z-40 max-h-[40vh] overflow-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl sm:relative sm:inset-auto sm:bottom-auto"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{selected.name}</h3>
                <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                  <MapPin className="h-4 w-4 shrink-0" />
                  {selected.address}
                </p>
                <p className="mt-2 text-sm text-pe-primary">
                  {selected.availableSlots} {tc(lang, "spots")} · {tc(lang, "sarHour")}:{" "}
                  {selected.pricePerHour}
                </p>
              </div>
              <button
                type="button"
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100"
                onClick={() => setSelected(null)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href={`/lots/${selected.id}`}
                className="inline-flex flex-1 min-w-[140px] items-center justify-center rounded-xl bg-pe-primary px-4 py-3 text-center text-sm font-semibold text-white shadow"
              >
                {tc(lang, "viewDetails")}
              </Link>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${selected.location.lat},${selected.location.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-1 min-w-[140px] items-center justify-center gap-2 rounded-xl border border-pe-primary bg-white px-4 py-3 text-sm font-semibold text-pe-primary"
              >
                <Navigation className="h-4 w-4" />
                {tc(lang, "navigate")}
              </a>
            </div>
            <p className="mt-2 text-xs text-slate-400">
              {tc(lang, "distance")}:{" "}
              {formatDistance(
                Math.hypot(
                  (selected.location.lat - CENTER.lat) * 111000,
                  (selected.location.lng - CENTER.lng) * 88000
                )
              )}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
