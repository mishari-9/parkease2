import type { Lang } from "@/lib/i18n";
import type { ParkingLotCategory } from "@/types";

const en: Record<ParkingLotCategory, string> = {
  surface: "Open surface lot",
  multi_storey: "Multi-storey garage",
  faculty: "Faculty & staff",
  visitor: "Visitor parking",
  mixed: "Mixed use",
};

const ar: Record<ParkingLotCategory, string> = {
  surface: "موقف سطحي مكشوف",
  multi_storey: "موقف متعدد الطوابق",
  faculty: "موظفين وأعضاء هيئة تدريس",
  visitor: "زوار",
  mixed: "متعدد الاستخدام",
};

export function formatLotCategory(lang: Lang, c: ParkingLotCategory | undefined): string {
  if (!c) return lang === "ar" ? "موقف" : "Parking";
  return lang === "ar" ? ar[c] : en[c];
}
