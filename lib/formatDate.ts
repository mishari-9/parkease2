import { format } from "date-fns";
import { arSA, enUS } from "date-fns/locale";
import type { OpeningHours } from "@/types";

export function formatDateTime(date: Date, locale: string): string {
  const loc = locale === "ar" ? arSA : enUS;
  return format(date, "EEE, d MMM · h:mm a", { locale: loc });
}

export function formatDateShort(date: Date, locale: string): string {
  const loc = locale === "ar" ? arSA : enUS;
  return format(date, "d MMM", { locale: loc });
}

export function isLotOpenAt(hours: OpeningHours, date: Date): boolean {
  if (hours.is24Hours) return true;
  const day = date.getDay();
  if (hours.closedDays.includes(day)) return false;
  const [oh, om] = hours.openTime.split(":").map(Number);
  const [ch, cm] = hours.closeTime.split(":").map(Number);
  const mins = date.getHours() * 60 + date.getMinutes();
  const openM = oh * 60 + om;
  const closeM = ch * 60 + cm;
  return mins >= openM && mins <= closeM;
}
