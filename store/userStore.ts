import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";

const demoUser: User = {
  id: "user-demo",
  fullName: "Ahmed Al-Rashid",
  email: "ahmed@example.com",
  phone: "+966501234567",
  avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
  language: "en",
  vehicles: [
    {
      id: "v1",
      plate: "RJD 1024",
      make: "Toyota",
      model: "Camry",
      type: "sedan",
      color: "White",
      isDefault: true,
    },
    {
      id: "v2",
      plate: "ABC 8891",
      make: "Hyundai",
      model: "Tucson",
      type: "suv",
      color: "Black",
      isDefault: false,
    },
  ],
  paymentMethods: [
    { id: "pm1", label: "Mada •••• 4242", type: "mada", last4: "4242" },
    { id: "pm2", label: "STC Pay", type: "stc_pay" },
    { id: "pm3", label: "Apple Pay", type: "apple_pay" },
  ],
  savedLotIds: ["lot-1"],
  createdAt: new Date("2024-01-15"),
};

interface UserState {
  user: User;
  notificationsOn: boolean;
  setLanguage: (lang: "ar" | "en") => void;
  toggleSavedLot: (lotId: string) => void;
  setNotifications: (on: boolean) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: demoUser,
      notificationsOn: true,
      setLanguage: (language) =>
        set((s) => ({
          user: { ...s.user, language },
        })),
      toggleSavedLot: (lotId) =>
        set((s) => {
          const ids = s.user.savedLotIds;
          const has = ids.includes(lotId);
          return {
            user: {
              ...s.user,
              savedLotIds: has ? ids.filter((x) => x !== lotId) : [...ids, lotId],
            },
          };
        }),
      setNotifications: (notificationsOn) => set({ notificationsOn }),
    }),
    {
      name: "parkease-user",
      partialize: (s) => ({
        user: s.user,
        notificationsOn: s.notificationsOn,
      }),
    }
  )
);
