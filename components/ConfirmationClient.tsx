"use client";

import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/PageHeader";
import { useBookingHistoryStore } from "@/store/bookingHistoryStore";
import { useUserStore } from "@/store/userStore";
import { formatDateTime } from "@/lib/formatDate";
import { formatPrice } from "@/lib/formatPrice";
import { tc } from "@/lib/i18n";
import { MapPin, ExternalLink } from "lucide-react";

type Props = { bookingId: string };

export function ConfirmationClient({ bookingId }: Props) {
  const lang = useUserStore((s) => s.user.language);
  const booking = useBookingHistoryStore((s) => s.bookings.find((b) => b.id === bookingId));

  if (!booking) {
    return (
      <div className="min-h-screen bg-pe-surface px-4 py-8">
        <PageHeader title="Confirmation" backHref="/" />
        <p className="mt-8 text-center text-slate-600">
          {lang === "ar" ? "لم يُعثر على الحجز." : "Booking not found. Start a new reservation from the map."}
        </p>
        <Link href="/" className="mt-6 block text-center text-pe-primary underline">
          {tc(lang, "map")}
        </Link>
      </div>
    );
  }

  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${booking.lot.location.lat},${booking.lot.location.lng}`;

  return (
    <div className="min-h-screen bg-pe-surface pb-12">
      <PageHeader title={lang === "ar" ? "تم التأكيد" : "Confirmed"} backHref="/bookings" />

      <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="rounded-3xl bg-white p-6 shadow-card"
        >
          <QRCodeSVG value={booking.qrCodeData} size={220} level="H" includeMargin />
        </motion.div>
        <p className="mt-3 text-center text-xs text-slate-500">
          {lang === "ar" ? "اعرض هذا الرمز عند المدخل" : "Show this code at the gate"}
        </p>

        <div className="mt-8 w-full space-y-3 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">{booking.lot.name}</h2>
          <p className="flex items-start gap-2 text-sm text-slate-600">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-pe-primary" />
            {booking.lot.address}
          </p>
          <p className="text-sm text-slate-700">
            {lang === "ar" ? "الموقف" : "Slot"}: <strong>{booking.slot.label}</strong>
          </p>
          <p className="text-sm text-slate-700">
            {formatDateTime(new Date(booking.startTime), lang)} →{" "}
            {formatDateTime(new Date(booking.endTime), lang)}
          </p>
          <p className="text-base font-bold text-pe-primary">
            {formatPrice(booking.payment.totalAmount, "SAR", lang)}
          </p>
        </div>

        <div className="mt-6 flex w-full flex-col gap-3">
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-pe-primary text-sm font-bold text-white shadow-lg"
          >
            <ExternalLink className="h-4 w-4" />
            {tc(lang, "openMaps")}
          </a>
          <Link
            href="/"
            className="flex h-12 items-center justify-center rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-800"
          >
            {tc(lang, "done")}
          </Link>
        </div>
      </div>
    </div>
  );
}
