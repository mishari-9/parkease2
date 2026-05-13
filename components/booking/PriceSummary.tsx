"use client";

import type { ParkingLot } from "@/types";
import { calculateBookingPrice } from "@/lib/priceCalc";
import { formatPrice } from "@/lib/formatPrice";
import { useUserStore } from "@/store/userStore";

type Props = {
  lot: ParkingLot;
  start: Date;
  end: Date;
};

export function PriceSummary({ lot, start, end }: Props) {
  const lang = useUserStore((s) => s.user.language);
  const p = calculateBookingPrice(lot, start, end);
  return (
    <div className="space-y-2 rounded-xl border border-slate-100 bg-pe-surface p-4 text-sm">
      <div className="flex justify-between">
        <span className="text-slate-600">{lang === "ar" ? "المدة" : "Duration"}</span>
        <span className="font-medium text-slate-900">{p.hours.toFixed(2)} h</span>
      </div>
      <div className="flex justify-between">
        <span className="text-slate-600">{lang === "ar" ? "الأساس" : "Parking"}</span>
        <span>{formatPrice(p.baseAmount, "SAR", lang)}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-slate-600">{lang === "ar" ? "رسوم الخدمة" : "Service fee (5%)"}</span>
        <span>{formatPrice(p.serviceFee, "SAR", lang)}</span>
      </div>
      <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-bold text-pe-primary">
        <span>{lang === "ar" ? "الإجمالي" : "Total"}</span>
        <span>{formatPrice(p.totalAmount, "SAR", lang)}</span>
      </div>
    </div>
  );
}
