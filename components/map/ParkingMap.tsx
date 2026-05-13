"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import type { ParkingLot } from "@/types";
import { campusCenter } from "@/data/mockLots";
import { useThemeStore } from "@/store/themeStore";

const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[280px] items-center justify-center rounded-2xl bg-pe-surface text-sm text-slate-500 dark:bg-slate-900/80 dark:text-slate-400">
      Loading map…
    </div>
  ),
});

type Props = {
  lots: ParkingLot[];
  onSelectLot?: (lot: ParkingLot) => void;
  className?: string;
};

export function ParkingMap({ lots, onSelectLot, className = "" }: Props) {
  const center = useMemo(() => {
    const c = campusCenter();
    return [c.lat, c.lng] as [number, number];
  }, []);
  const darkTiles = useThemeStore((s) => s.resolved === "dark");

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl border border-slate-200 shadow-card dark:border-slate-600 dark:shadow-none ${className}`}
    >
      <LeafletMap
        lots={lots}
        center={center}
        zoom={17}
        onSelectLot={onSelectLot}
        darkTiles={darkTiles}
      />
    </div>
  );
}
