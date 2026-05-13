"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { SiteHeader } from "@/components/SiteHeader";
import { useBookingHistoryStore } from "@/store/bookingHistoryStore";
import { useUserStore } from "@/store/userStore";
import { tc } from "@/lib/i18n";
import { formatDateTime } from "@/lib/formatDate";
import { formatPrice } from "@/lib/formatPrice";

type Tab = "upcoming" | "past" | "cancelled";

export default function BookingsPage() {
  const lang = useUserStore((s) => s.user.language);
  const bookings = useBookingHistoryStore((s) => s.bookings);
  const cancelBooking = useBookingHistoryStore((s) => s.cancelBooking);
  const [tab, setTab] = useState<Tab>("upcoming");

  const filtered = useMemo(() => {
    const now = Date.now();
    return bookings.filter((b) => {
      const end = new Date(b.endTime).getTime();
      if (tab === "cancelled") return b.status === "cancelled";
      if (tab === "past") return end < now && b.status !== "cancelled";
      return end >= now && b.status !== "cancelled";
    });
  }, [bookings, tab]);

  const tabs: { id: Tab; labelKey: "upcoming" | "past" | "cancelled" }[] = [
    { id: "upcoming", labelKey: "upcoming" },
    { id: "past", labelKey: "past" },
    { id: "cancelled", labelKey: "cancelled" },
  ];

  return (
    <>
      <SiteHeader />
      <div className="mx-auto max-w-7xl px-4 py-4 pb-28 sm:px-6 lg:px-8 lg:pb-10">
        <div className="flex rounded-2xl bg-white p-1 shadow-sm ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-700">
          {tabs.map(({ id, labelKey }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`relative flex-1 rounded-xl py-2.5 text-xs font-semibold transition ${
                tab === id
                  ? "text-pe-primary"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              {tab === id && (
                <motion.span
                  layoutId="book-tab"
                  className="absolute inset-0 rounded-xl bg-pe-light dark:bg-slate-800"
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}
              <span className="relative z-10">{tc(lang, labelKey)}</span>
            </button>
          ))}
        </div>

        <ul className="mt-6 grid gap-4 lg:grid-cols-2">
          {filtered.map((b, i) => (
            <motion.li
              key={b.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="flex overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card dark:border-slate-700 dark:bg-slate-900"
            >
              <Link
                href={`/confirmation/${b.id}`}
                className="flex min-w-0 flex-1 gap-4 p-3 transition hover:bg-pe-light/40 dark:hover:bg-slate-800/60"
              >
                <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
                  <Image
                    src={
                      b.lot.photoUrls?.[0] ??
                      "https://images.unsplash.com/photo-1590674899484-d5640d0f7b3a?auto=format&fit=crop&w=800&q=90"
                    }
                    alt={b.lot.name}
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                </div>
                <div className="min-w-0 flex-1 py-1">
                  <p className="line-clamp-2 font-bold text-slate-900 dark:text-white">
                    {b.lot.name}
                  </p>
                  {b.lot.mapLabel && (
                    <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wide text-pe-primary">
                      {b.lot.mapLabel}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {b.slot.label} ·{" "}
                    {formatDateTime(new Date(b.startTime), lang)}
                  </p>
                  <p className="mt-2 text-sm font-bold text-pe-primary">
                    {formatPrice(b.payment.totalAmount, "SAR", lang)}
                  </p>
                </div>
              </Link>
              {tab === "upcoming" && (
                <div className="flex shrink-0 flex-col justify-center border-s border-slate-100 px-3 dark:border-slate-700">
                  <button
                    type="button"
                    className="rounded-lg px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
                    onClick={() => cancelBooking(b.id)}
                  >
                    {lang === "ar" ? "إلغاء" : "Cancel"}
                  </button>
                </div>
              )}
            </motion.li>
          ))}
        </ul>

        {filtered.length === 0 && (
          <div className="mt-16 text-center">
            <p className="text-slate-600 dark:text-slate-300">
              {tc(lang, "noBookings")}
            </p>
            <Link
              href="/"
              className="mt-4 inline-flex rounded-xl bg-gradient-to-r from-pe-primary to-pe-accent px-6 py-3 text-sm font-bold text-white shadow-lg"
            >
              {tc(lang, "exploreMap")}
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
