"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/PageHeader";
import { PriceSummary } from "@/components/booking/PriceSummary";
import { useBookingFlowStore } from "@/store/bookingFlowStore";
import { useUserStore } from "@/store/userStore";
import { useBookingHistoryStore } from "@/store/bookingHistoryStore";
import { useThemeStore } from "@/store/themeStore";
import { getLotById } from "@/data/mockLots";
import { calculateBookingPrice } from "@/lib/priceCalc";
import { generateQRPayload } from "@/lib/generateQR";
import type { Booking, PaymentMethodType, Vehicle } from "@/types";
import { tc } from "@/lib/i18n";
import { addHours } from "date-fns";
import { Car, Truck, Bike } from "lucide-react";

function vehicleTypeIcon(type: Vehicle["type"]) {
  switch (type) {
    case "truck":
      return <Truck className="h-7 w-7 shrink-0 text-pe-primary" aria-hidden />;
    case "motorcycle":
      return <Bike className="h-7 w-7 shrink-0 text-pe-primary" aria-hidden />;
    case "suv":
    case "sedan":
    default:
      return <Car className="h-7 w-7 shrink-0 text-pe-primary" aria-hidden />;
  }
}

function vehicleTypeLabel(lang: "en" | "ar", type: Vehicle["type"]) {
  const en: Record<Vehicle["type"], string> = {
    sedan: "Sedan",
    suv: "SUV",
    truck: "Truck / van",
    motorcycle: "Motorcycle",
  };
  const ar: Record<Vehicle["type"], string> = {
    sedan: "سيدان",
    suv: "دفع رباعي",
    truck: "شاحنة / فان",
    motorcycle: "دراجة",
  };
  return lang === "ar" ? ar[type] : en[type];
}

const steps = ["stepTime", "stepVehicle", "stepReview", "stepPay"] as const;

type Props = { lotId: string };

export function BookingFlowClient({ lotId }: Props) {
  const router = useRouter();
  const lang = useUserStore((s) => s.user.language);
  const user = useUserStore((s) => s.user);
  const lot = getLotById(lotId);

  const step = useBookingFlowStore((s) => s.step);
  const setStep = useBookingFlowStore((s) => s.setStep);
  const slotId = useBookingFlowStore((s) => s.slotId);
  const startTime = useBookingFlowStore((s) => s.startTime);
  const endTime = useBookingFlowStore((s) => s.endTime);
  const setTimeRange = useBookingFlowStore((s) => s.setTimeRange);
  const vehicleId = useBookingFlowStore((s) => s.vehicleId);
  const setVehicle = useBookingFlowStore((s) => s.setVehicle);
  const paymentMethod = useBookingFlowStore((s) => s.paymentMethod);
  const setPaymentMethod = useBookingFlowStore((s) => s.setPaymentMethod);
  const setSubmitting = useBookingFlowStore((s) => s.setSubmitting);
  const isSubmitting = useBookingFlowStore((s) => s.isSubmitting);
  const addBooking = useBookingHistoryStore((s) => s.addBooking);
  const darkUi = useThemeStore((s) => s.resolved === "dark");

  const [localStart, setLocalStart] = useState(() => {
    const d = new Date();
    d.setMinutes(0, 0, 0);
    d.setHours(d.getHours() + 1);
    return startTime ?? d;
  });
  const [localEnd, setLocalEnd] = useState(() => {
    const d = new Date();
    d.setMinutes(0, 0, 0);
    d.setHours(d.getHours() + 3);
    return endTime ?? d;
  });

  const slot = useMemo(() => {
    if (!lot || !slotId) return null;
    return lot.slots.find((s) => s.id === slotId) ?? null;
  }, [lot, slotId]);

  if (!lot || !slot) {
    return (
      <div className="min-h-screen bg-[var(--background)] px-4 py-8">
        <PageHeader title="Booking" backHref="/" />
        <p className="mx-auto mt-8 max-w-md text-center text-slate-600 dark:text-slate-300">
          {lang === "ar"
            ? "لم يتم اختيار موقف. ارجع واختر موقفاً من صفحة الموقف."
            : "No slot selected. Open a lot, pick a free slot, then tap Reserve."}
        </p>
        <button
          type="button"
          className="mx-auto mt-6 block rounded-xl bg-pe-primary px-6 py-3 text-white"
          onClick={() => router.push(`/lots/${lotId}`)}
        >
          {tc(lang, "viewDetails")}
        </button>
      </div>
    );
  }

  const syncTimes = () => setTimeRange(localStart, localEnd);

  const applyDurationHours = (h: number) => {
    const end = addHours(localStart, h);
    setLocalEnd(end);
    setTimeRange(localStart, end);
  };

  const canNext =
    step === 1
      ? localEnd > localStart
      : step === 2
        ? !!vehicleId
        : step === 3
          ? true
          : !!paymentMethod;

  const goNext = () => {
    if (step === 1) syncTimes();
    if (step < 4) setStep(step + 1);
  };

  const goBack = () => {
    if (step > 1) setStep(step - 1);
    else router.push(`/lots/${lotId}`);
  };

  const pay = async () => {
    if (!vehicleId || !paymentMethod) return;
    setSubmitting(true);
    syncTimes();
    await new Promise((r) => setTimeout(r, 900));
    const price = calculateBookingPrice(lot, localStart, localEnd);
    const bookingId = typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `bk-${Date.now()}`;

    const booking: Booking = {
      id: bookingId,
      userId: user.id,
      lotId: lot.id,
      slotId: slot.id,
      vehicleId,
      startTime: localStart.toISOString(),
      endTime: localEnd.toISOString(),
      status: "confirmed",
      payment: {
        id: `pi_demo_${bookingId}`,
        baseAmount: price.baseAmount,
        serviceFee: price.serviceFee,
        totalAmount: price.totalAmount,
        method: paymentMethod,
        status: "paid",
        paidAt: new Date(),
      },
      qrCodeData: "",
      lot: { ...lot, slots: [] },
      slot: { ...slot },
      review: null,
      createdAt: new Date().toISOString(),
    };
    booking.qrCodeData = generateQRPayload(booking);
    addBooking(booking);
    setSubmitting(false);
    router.push(`/confirmation/${bookingId}`);
  };

  const methods: { id: PaymentMethodType; label: string }[] = [
    { id: "mada", label: "Mada" },
    { id: "stc_pay", label: "STC Pay" },
    { id: "apple_pay", label: "Apple Pay" },
    { id: "card", label: "Card" },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] pb-12">
      <PageHeader title={tc(lang, "reserve")} backHref={`/lots/${lotId}`} />

      <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex gap-1">
          {steps.map((key, i) => {
            const n = i + 1;
            const active = step === n;
            const done = step > n;
            return (
              <div key={key} className="flex flex-1 flex-col items-center gap-1">
                <motion.div
                  animate={{
                    scale: active ? 1.05 : 1,
                    backgroundColor: done || active ? "#1A6FBF" : darkUi ? "#334155" : "#e2e8f0",
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
                >
                  {done ? "✓" : n}
                </motion.div>
                <span
                  className={`text-[10px] font-medium ${
                    active ? "text-pe-primary" : "text-slate-400 dark:text-slate-500"
                  }`}
                >
                  {tc(lang, key)}
                </span>
              </div>
            );
          })}
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card dark:border-slate-700 dark:bg-slate-900"
        >
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                {lang === "ar" ? "وقت البداية والنهاية" : "Start & end"}
              </p>
              <label className="block text-xs text-slate-500 dark:text-slate-400">Start</label>
              <input
                type="datetime-local"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
                value={toLocalInput(localStart)}
                onChange={(e) => {
                  const d = new Date(e.target.value);
                  if (!Number.isNaN(d.getTime())) setLocalStart(d);
                }}
              />
              <label className="block text-xs text-slate-500 dark:text-slate-400">End</label>
              <input
                type="datetime-local"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
                value={toLocalInput(localEnd)}
                onChange={(e) => {
                  const d = new Date(e.target.value);
                  if (!Number.isNaN(d.getTime())) setLocalEnd(d);
                }}
              />
              <div className="flex flex-wrap gap-2">
                {[1, 2, 4, 8].map((h) => (
                  <button
                    key={h}
                    type="button"
                    className="rounded-full bg-pe-light px-4 py-2 text-xs font-semibold text-pe-primary transition hover:brightness-95 dark:bg-slate-800 dark:text-sky-300"
                    onClick={() => applyDurationHours(h)}
                  >
                    {h}h
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {lang === "ar"
                  ? "اختر المركبة المناسبة لنوع الموقف (سيدان، دفع رباعي، …)."
                  : "Pick the vehicle that matches your plate — class is shown for the gate."}
              </p>
              {user.vehicles.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setVehicle(v.id)}
                  className={`flex w-full items-center gap-4 rounded-2xl border px-4 py-4 text-left transition ${
                    vehicleId === v.id
                      ? "border-pe-primary bg-pe-light shadow-md dark:bg-slate-800"
                      : "border-slate-200 bg-white hover:border-pe-primary/40 dark:border-slate-600 dark:bg-slate-950"
                  }`}
                >
                  {vehicleTypeIcon(v.type)}
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-900 dark:text-white">
                      {v.plate}{" "}
                      <span className="font-normal text-slate-500 dark:text-slate-400">
                        — {v.make} {v.model}
                      </span>
                    </p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-pe-primary">
                      {vehicleTypeLabel(lang, v.type)} · {v.color}
                    </p>
                  </div>
                  {vehicleId === v.id && (
                    <motion.span
                      layoutId="veh-check"
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-pe-primary text-sm font-bold text-white"
                    >
                      ✓
                    </motion.span>
                  )}
                </button>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{lot.name}</p>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {lang === "ar" ? "الموقف" : "Slot"}: {slot.label}
              </p>
              {(() => {
                const v = user.vehicles.find((x) => x.id === vehicleId);
                if (!v) return null;
                return (
                  <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-pe-surface px-3 py-2 dark:border-slate-700 dark:bg-slate-800">
                    {vehicleTypeIcon(v.type)}
                    <div className="text-sm">
                      <p className="font-semibold text-slate-900 dark:text-white">{v.plate}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {vehicleTypeLabel(lang, v.type)} · {v.make} {v.model}
                      </p>
                    </div>
                  </div>
                );
              })()}
              <PriceSummary lot={lot} start={localStart} end={localEnd} />
            </div>
          )}

          {step === 4 && (
            <div className="space-y-2">
              {methods.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMethod(m.id)}
                  className={`w-full rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                    paymentMethod === m.id
                      ? "border-pe-primary bg-pe-light text-pe-primary dark:bg-slate-800"
                      : "border-slate-200 bg-white text-slate-700 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-200"
                  }`}
                >
                  {m.label}
                </button>
              ))}
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {lang === "ar"
                  ? "عرض تجريبي — لا يتم تحصيل رسوم حقيقية."
                  : "Demo — no real charges. Stripe can be wired later."}
              </p>
            </div>
          )}
        </motion.div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={goBack}
            className="h-12 flex-1 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200"
          >
            {lang === "ar" ? "رجوع" : "Back"}
          </button>
          {step < 4 ? (
            <button
              type="button"
              disabled={!canNext}
              onClick={goNext}
              className="h-12 flex-[2] rounded-xl bg-pe-primary text-sm font-bold text-white disabled:bg-slate-300"
            >
              {lang === "ar" ? "التالي" : "Next"}
            </button>
          ) : (
            <button
              type="button"
              disabled={!paymentMethod || isSubmitting}
              onClick={pay}
              className="h-12 flex-[2] rounded-xl bg-pe-primary text-sm font-bold text-white disabled:bg-slate-300"
            >
              {isSubmitting ? "…" : tc(lang, "payNow")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function toLocalInput(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
