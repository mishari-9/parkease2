"use client";

import type { ParkingSlot } from "@/types";
import { colors } from "@/constants/colors";
import { motion } from "framer-motion";

type Props = {
  slots: ParkingSlot[];
  selectedSlotId: string | null;
  onSlotSelect: (slot: ParkingSlot) => void;
};

const statusColor: Record<ParkingSlot["status"], string> = {
  available: colors.slotFree,
  occupied: colors.slotFull,
  reserved: colors.slotLow,
  maintenance: colors.slotMaint,
};

export function SlotGrid({ slots, selectedSlotId, onSlotSelect }: Props) {
  return (
    <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-8 sm:gap-2">
      {slots.map((slot, i) => {
        const disabled = slot.status !== "available";
        const selected = slot.id === selectedSlotId;
        return (
          <motion.button
            key={slot.id}
            type="button"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.012 }}
            whileTap={disabled ? {} : { scale: 0.92 }}
            disabled={disabled}
            onClick={() => !disabled && onSlotSelect(slot)}
            className={`flex aspect-square flex-col items-center justify-center rounded-lg text-[10px] font-bold sm:text-xs ${
              disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer shadow-sm"
            } ${selected ? "ring-2 ring-pe-primary ring-offset-2" : ""}`}
            style={{ backgroundColor: statusColor[slot.status], color: "#fff" }}
            title={slot.label}
          >
            {slot.label}
          </motion.button>
        );
      })}
    </div>
  );
}
