"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import type { ParkingLot } from "@/types";

const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[320px] items-center justify-center rounded-2xl bg-pe-surface text-sm text-slate-500">
      Loading map…
    </div>
  ),
});

type Props = {
  lots: ParkingLot[];
  onSelectLot?: (lot: ParkingLot) => void;
};

const DEFAULT_CENTER: [number, number] = [24.7136, 46.6753];

export function ParkingMap({ lots, onSelectLot }: Props) {
  const center = useMemo(() => DEFAULT_CENTER, []);
  return (
    <div className="relative h-[min(55vh,420px)] w-full overflow-hidden rounded-2xl border border-slate-200 shadow-card">
      <LeafletMap lots={lots} center={center} zoom={12} onSelectLot={onSelectLot} />
    </div>
  );
}
