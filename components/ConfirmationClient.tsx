"use client";

import Link from "next/link";
import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/PageHeader";
import { useBookingHistoryStore } from "@/store/bookingHistoryStore";
import { useUserStore } from "@/store/userStore";
import { formatDateTime } from "@/lib/formatDate";
import { formatPrice } from "@/lib/formatPrice";
import { formatLotCategory } from "@/lib/formatLotCategory";
import { tc } from "@/lib/i18n";
import { MapPin, ExternalLink } from "lucide-react";

type Props = { bookingId: string };

export function ConfirmationClient({ bookingId }: Props) {
  const lang = useUserStore((s) => s.user.language);
  const booking = useBookingHistoryStore((s) => s.bookings.find((b) => b.id === bookingId));

  if (!booking) {
    return (
      <div className="min-h-screen bg-[var(--background)] px-4 py-8">
        <PageHeader title="Confirmation" backHref="/" />
        <p className="mt-8 text-center text-slate-600 dark:text-slate-300">
          {lang === "ar" ? "لم يُعثر على الحجز." : "Booking not found. Start a new reservation from the map."}
        </p>
        <Link href="/" className="mt-6 block text-center text-pe-primary underline">
          {tc(lang, "map")}
        </Link>
      </div>
    );
  }

  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${booking.lot.location.lat},${booking.lot.location.lng}`;
  const cover =
    booking.lot.photoUrls?.[0] ??
    "https://images.unsplash.com/photo-1506521781263-d8422e82f57a?auto=format&fit=crop&w=1600&q=90";

  return (
    <div className="min-h-screen bg-[var(--background)] pb-12">
      <PageHeader title={lang === "ar" ? "تم التأكيد" : "Confirmed"} backHref="/bookings" />

      <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-6 sm:px-6 lg:px-8">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative w-full overflow-hidden rounded-3xl shadow-card"
        >
          <div className="relative aspect-[21/9] w-full">
            <Image src={cover} alt={booking.lot.name} fill className="object-cover" sizes="896px" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <p className="absolute bottom-3 start-4 end-4 text-sm font-bold text-white drop-shadow-md">
              {booking.lot.name}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="-mt-8 relative z-10 rounded-3xl bg-white p-6 shadow-xl dark:border dark:border-slate-600 dark:bg-slate-900"
        >
          <QRCodeSVG value={booking.qrCodeData} size={220} level="H" includeMargin />
        </motion.div>
        <p className="mt-3 text-center text-xs text-slate-500 dark:text-slate-400">
          {lang === "ar" ? "اعرض هذا الرمز عند المدخل" : "Show this code at the gate"}
        </p>

        <div className="mt-8 w-full space-y-3 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">{booking.lot.name}</h2>
          {booking.lot.mapLabel && (
            <p className="text-xs font-bold uppercase tracking-wide text-pe-primary">{booking.lot.mapLabel}</p>
          )}
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {formatLotCategory(lang, booking.lot.category)}
          </p>
          <p className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-pe-primary" />
            {booking.lot.address}
          </p>
          <p className="text-sm text-slate-700 dark:text-slate-200">
            {lang === "ar" ? "الموقف" : "Slot"}: <strong>{booking.slot.label}</strong>
          </p>
          <p className="text-sm text-slate-700 dark:text-slate-200">
            {formatDateTime(new Date(booking.startTime), lang)} →{" "}
            {formatDateTime(new Date(booking.endTime), lang)}
          </p>
          <p className="text-base font-bold text-pe-primary">
            {formatPrice(booking.payment.totalAmount, "SAR", lang)}
          </p>
        </div>

        <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row">
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pe-primary to-pe-accent text-sm font-bold text-white shadow-lg"
          >
            <ExternalLink className="h-4 w-4" />
            {tc(lang, "openMaps")}
          </a>
          <Link
            href="/"
            className="flex h-12 flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-800 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
          >
            {tc(lang, "done")}
          </Link>
        </div>
      </div>
    </div>
  );
}
