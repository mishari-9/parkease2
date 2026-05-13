"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/PageHeader";
import { SlotGrid } from "@/components/booking/SlotGrid";
import type { ParkingLot, ParkingSlot } from "@/types";
import { useBookingFlowStore } from "@/store/bookingFlowStore";
import { useUserStore } from "@/store/userStore";
import { isLotOpenAt } from "@/lib/formatDate";
import { tc } from "@/lib/i18n";
import { Star, Heart } from "lucide-react";

type Props = { lot: ParkingLot };

export function LotDetailClient({ lot }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const presetSlot = searchParams.get("slot");
  const lang = useUserStore((s) => s.user.language);
  const saved = useUserStore((s) => s.user.savedLotIds.includes(lot.id));
  const toggleSaved = useUserStore((s) => s.toggleSavedLot);
  const setSlot = useBookingFlowStore((s) => s.setSlot);
  const setLot = useBookingFlowStore((s) => s.setLot);
  const reset = useBookingFlowStore((s) => s.reset);

  const floors = useMemo(
    () => Array.from(new Set(lot.slots.map((s) => s.floor))).sort((a, b) => a - b),
    [lot.slots]
  );
  const [floor, setFloor] = useState(floors[0] ?? 1);
  const [selected, setSelected] = useState<ParkingSlot | null>(() => {
    if (!presetSlot) return null;
    return lot.slots.find((s) => s.id === presetSlot && s.status === "available") ?? null;
  });

  const filtered = useMemo(
    () => lot.slots.filter((s) => s.floor === floor),
    [lot.slots, floor]
  );

  const openNow = isLotOpenAt(lot.hours, new Date());

  const onReserve = () => {
    if (!selected) return;
    reset();
    setLot(lot.id);
    setSlot(selected.id);
    router.push(`/book/${lot.id}`);
  };

  return (
    <div className="min-h-screen bg-pe-surface pb-28">
      <PageHeader title={lot.name} backHref="/" />
      <div className="mx-auto max-w-lg px-4 py-4">
        <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-slate-200 shadow-card">
          <Image
            src={lot.photoUrls[0] ?? "https://images.unsplash.com/photo-1506521781263-d8422e82f57a?w=800&q=80"}
            alt={lot.name}
            fill
            className="object-cover"
            sizes="(max-width:768px) 100vw, 480px"
            priority
          />
          <button
            type="button"
            onClick={() => toggleSaved(lot.id)}
            className="absolute end-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-pe-primary shadow"
            aria-label="Save"
          >
            <Heart className={`h-5 w-5 ${saved ? "fill-red-500 text-red-500" : ""}`} />
          </button>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-amber-800">
            <Star className="h-4 w-4 fill-amber-400 text-amber-500" />
            <span className="text-sm font-semibold">{lot.rating}</span>
            <span className="text-xs text-amber-700/80">({lot.reviewCount})</span>
          </div>
          <span
            className={`rounded-full px-2 py-1 text-xs font-medium ${
              openNow ? "bg-emerald-50 text-emerald-800" : "bg-slate-100 text-slate-600"
            }`}
          >
            {openNow ? (lang === "ar" ? "مفتوح الآن" : "Open now") : lang === "ar" ? "مغلق" : "Closed"}
          </span>
        </div>

        <p className="mt-2 text-sm text-slate-600">{lot.address}</p>
        <p className="mt-1 text-sm font-semibold text-pe-primary">
          SAR {lot.pricePerHour} / hr · {lot.availableSlots} {tc(lang, "spots")}
        </p>

        <div className="mt-6">
          <h3 className="text-base font-semibold text-slate-900">
            {lang === "ar" ? "اختر الطابق" : "Floor"}
          </h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {floors.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFloor(f)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  floor === f
                    ? "bg-pe-primary text-white shadow"
                    : "bg-white text-slate-600 ring-1 ring-slate-200"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-base font-semibold text-slate-900">{tc(lang, "availability")}</h3>
          <p className="mt-1 text-xs text-slate-500">
            {lang === "ar" ? "أخضر متاح · برتقالي محجوز · أحمر مشغول" : "Green free · Orange reserved · Red busy"}
          </p>
          <div className="mt-3">
            <SlotGrid slots={filtered} selectedSlotId={selected?.id ?? null} onSlotSelect={setSelected} />
          </div>
        </div>

        <motion.div
          layout
          className="fixed inset-x-0 bottom-[60px] z-30 border-t border-slate-200 bg-white/95 p-4 backdrop-blur sm:relative sm:bottom-auto sm:mt-8 sm:rounded-2xl sm:border sm:shadow-card"
        >
          <button
            type="button"
            disabled={!selected}
            onClick={onReserve}
            className="flex h-12 w-full items-center justify-center rounded-xl bg-pe-primary text-sm font-bold text-white shadow-lg transition enabled:hover:bg-pe-primary-dark disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {tc(lang, "reserve")}
          </button>
          {!selected && (
            <p className="mt-2 text-center text-xs text-slate-500">{tc(lang, "selectSlot")}</p>
          )}
          <Link href="/" className="mt-2 block text-center text-sm text-pe-primary underline">
            {lang === "ar" ? "العودة للخريطة" : "Back to map"}
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
