import type { ParkingLot, PriceBreakdown } from "@/types";

const HALF_HOUR_MS = 30 * 60 * 1000;

export function calculateBookingPrice(
  lot: ParkingLot,
  start: Date,
  end: Date
): PriceBreakdown {
  const rawMs = end.getTime() - start.getTime();
  const billedMs = Math.ceil(rawMs / HALF_HOUR_MS) * HALF_HOUR_MS;
  const hours = billedMs / (60 * 60 * 1000);
  const baseAmount = hours * lot.pricePerHour;
  const serviceFee = baseAmount * 0.05;
  const totalAmount = baseAmount + serviceFee;
  return {
    hours,
    baseAmount: Math.round(baseAmount * 100) / 100,
    serviceFee: Math.round(serviceFee * 100) / 100,
    totalAmount: Math.round(totalAmount * 100) / 100,
  };
}
