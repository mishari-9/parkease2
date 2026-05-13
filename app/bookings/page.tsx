"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { SiteHeader } from "@/components/SiteHeader";
import { useBookingHistoryStore } from "@/store/bookingHistoryStore";
import { useUserStore } from "@/store/userStore";
import { tc } from "@/lib/i18n";
import { formatDateTime } from "@/lib/formatDate";
import { formatPrice } from "@/lib/formatPrice";
import Image from "next/image";

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
      <div className="mx-auto max-w-lg px-4 py-4 pb-28">
        <div className="flex rounded-xl bg-white p-1 shadow-sm ring-1 ring-slate-100">
          {tabs.map(({ id, labelKey }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`relative flex-1 rounded-lg py-2 text-xs font-semibold transition ${
                tab === id ? "text-pe-primary" : "text-slate-500"
              }`}
            >
              {tab === id && (
                <motion.span
                  layoutId="book-tab"
                  className="absolute inset-0 rounded-lg bg-pe-light"
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}
              <span className="relative z-10">{tc(lang, labelKey)}</span>
            </button>
          ))}
        </div>

        <ul className="mt-4 space-y-3">
          {filtered.map((b, i) => (
            <motion.li
              key={b.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="flex overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card"
            >
              <Link
                href={`/confirmation/${b.id}`}
                className="flex min-w-0 flex-1 gap-3 p-3"
              >
                <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                  <Image
                    src={
                      b.lot.photoUrls[0] ??
                      "https://images.unsplash.com/photo-1506521781263-d8422e82f57a?w=200&q=80"
                    }
                    alt={b.lot.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
                <div className="min-w-0 flex-1 py-0.5">
                  <p className="truncate font-semibold text-slate-900">{b.lot.name}</p>
                  <p className="text-xs text-slate-500">
                    {b.slot.label} · {formatDateTime(new Date(b.startTime), lang)}
                  </p>
                  <p className="mt-1 text-sm font-bold text-pe-primary">
                    {formatPrice(b.payment.totalAmount, "SAR", lang)}
                  </p>
                </div>
              </Link>
              {tab === "upcoming" && (
                <div className="flex shrink-0 flex-col justify-center border-s border-slate-100 px-2">
                  <button
                    type="button"
                    className="rounded-lg px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
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
          <div className="mt-12 text-center">
            <p className="text-slate-600">{tc(lang, "noBookings")}</p>
            <Link
              href="/"
              className="mt-4 inline-flex rounded-xl bg-pe-primary px-6 py-3 text-sm font-semibold text-white"
            >
              {tc(lang, "exploreMap")}
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
