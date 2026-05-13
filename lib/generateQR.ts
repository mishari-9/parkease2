import type { Booking } from "@/types";

function toBase64Url(s: string): string {
  const b =
    typeof window !== "undefined"
      ? window.btoa(unescape(encodeURIComponent(s)))
      : Buffer.from(s, "utf-8").toString("base64");
  return b.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** Demo payload (replace with server-signed JWT in production). */
export function generateQRPayload(booking: Booking): string {
  const payload = JSON.stringify({
    bookingId: booking.id,
    slotId: booking.slotId,
    userId: booking.userId,
    exp: Math.floor(new Date(booking.endTime).getTime() / 1000),
  });
  return `PE.${toBase64Url(payload)}`;
}
