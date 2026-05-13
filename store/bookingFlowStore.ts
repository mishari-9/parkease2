import { create } from "zustand";
import type { PaymentMethodType } from "@/types";

export interface BookingDraft {
  lotId: string | null;
  slotId: string | null;
  startTime: Date | null;
  endTime: Date | null;
  vehicleId: string | null;
  paymentMethod: PaymentMethodType | null;
  step: number;
}

interface BookingFlowState extends BookingDraft {
  isSubmitting: boolean;
  setLot: (lotId: string) => void;
  setSlot: (slotId: string) => void;
  setTimeRange: (start: Date, end: Date) => void;
  setVehicle: (vehicleId: string) => void;
  setPaymentMethod: (m: PaymentMethodType) => void;
  setStep: (step: number) => void;
  setSubmitting: (v: boolean) => void;
  reset: () => void;
}

const initial: BookingDraft = {
  lotId: null,
  slotId: null,
  startTime: null,
  endTime: null,
  vehicleId: null,
  paymentMethod: null,
  step: 1,
};

export const useBookingFlowStore = create<BookingFlowState>((set) => ({
  ...initial,
  isSubmitting: false,
  setLot: (lotId) => set({ lotId }),
  setSlot: (slotId) => set({ slotId }),
  setTimeRange: (startTime, endTime) => set({ startTime, endTime }),
  setVehicle: (vehicleId) => set({ vehicleId }),
  setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
  setStep: (step) => set({ step }),
  setSubmitting: (isSubmitting) => set({ isSubmitting }),
  reset: () => set({ ...initial, isSubmitting: false }),
}));
