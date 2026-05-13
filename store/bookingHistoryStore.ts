import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Booking, BookingStatus } from "@/types";

interface BookingHistoryState {
  bookings: Booking[];
  addBooking: (b: Booking) => void;
  cancelBooking: (id: string) => void;
  getById: (id: string) => Booking | undefined;
}

export const useBookingHistoryStore = create<BookingHistoryState>()(
  persist(
    (set, get) => ({
      bookings: [],
      addBooking: (b) => set((s) => ({ bookings: [b, ...s.bookings] })),
      cancelBooking: (id) =>
        set((s) => ({
          bookings: s.bookings.map((x) =>
            x.id === id ? { ...x, status: "cancelled" as BookingStatus } : x
          ),
        })),
      getById: (id) => get().bookings.find((b) => b.id === id),
    }),
    { name: "parkease-bookings" }
  )
);
