import type { ParkingLot, ParkingSlot } from "@/types";

function makeSlots(prefix: string, floors: number, perFloor: number): ParkingSlot[] {
  const slots: ParkingSlot[] = [];
  let i = 0;
  for (let f = 1; f <= floors; f++) {
    for (let n = 1; n <= perFloor; n++) {
      i++;
      const roll = i % 7;
      const status =
        roll === 0 ? "maintenance" : roll === 1 ? "occupied" : roll === 2 ? "reserved" : "available";
      const types: ParkingSlot["type"][] = ["standard", "compact", "standard", "ev", "disabled"];
      slots.push({
        id: `${prefix}-${f}-${n}`,
        label: `${String.fromCharCode(64 + f)}${n}`,
        status,
        type: types[i % types.length],
        floor: f,
      });
    }
  }
  return slots;
}

const RIYADH_CENTER = { lat: 24.7136, lng: 46.6753 };

export const MOCK_LOTS: ParkingLot[] = [
  {
    id: "lot-1",
    name: "King Abdullah Financial District P1",
    address: "KAFD, Riyadh",
    location: { lat: 24.7674, lng: 46.6426 },
    totalSlots: 120,
    availableSlots: 42,
    pricePerHour: 8,
    pricePerDay: 45,
    rating: 4.6,
    reviewCount: 128,
    photoUrls: [
      "https://images.unsplash.com/photo-1506521781263-d8422e82f57a?w=800&q=80",
      "https://images.unsplash.com/photo-1621929747188-9b2c9d7d9e1c?w=800&q=80",
    ],
    amenities: {
      covered: true,
      evCharging: true,
      disabledAccess: true,
      cctv: true,
      valet: false,
      carWash: true,
    },
    hours: { is24Hours: false, openTime: "06:00", closeTime: "23:00", closedDays: [5] },
    slots: makeSlots("kafd", 2, 18),
  },
  {
    id: "lot-2",
    name: "Al Olaya Street Garage",
    address: "Olaya, Riyadh",
    location: { lat: 24.7057, lng: 46.678 },
    totalSlots: 85,
    availableSlots: 6,
    pricePerHour: 12,
    pricePerDay: 60,
    rating: 4.2,
    reviewCount: 54,
    photoUrls: ["https://images.unsplash.com/photo-1573348722427-f0766824bcdc?w=800&q=80"],
    amenities: {
      covered: true,
      evCharging: false,
      disabledAccess: true,
      cctv: true,
      valet: true,
      carWash: false,
    },
    hours: { is24Hours: true, openTime: "00:00", closeTime: "23:59", closedDays: [] },
    slots: makeSlots("olaya", 1, 24),
  },
  {
    id: "lot-3",
    name: "Riyadh Park Mall Parking",
    address: "Northern Ring Rd, Riyadh",
    location: { lat: 24.7562, lng: 46.6288 },
    totalSlots: 200,
    availableSlots: 88,
    pricePerHour: 5,
    pricePerDay: 30,
    rating: 4.8,
    reviewCount: 312,
    photoUrls: ["https://images.unsplash.com/photo-1545175701-4f729f383c9d?w=800&q=80"],
    amenities: {
      covered: false,
      evCharging: true,
      disabledAccess: true,
      cctv: true,
      valet: false,
      carWash: false,
    },
    hours: { is24Hours: false, openTime: "08:00", closeTime: "02:00", closedDays: [] },
    slots: makeSlots("rpm", 3, 16),
  },
  {
    id: "lot-4",
    name: "Diplomatic Quarter Visitor Bay",
    address: "DQ, Riyadh",
    location: { lat: 24.69, lng: 46.62 },
    totalSlots: 64,
    availableSlots: 0,
    pricePerHour: 15,
    pricePerDay: 90,
    rating: 4.9,
    reviewCount: 41,
    photoUrls: ["https://images.unsplash.com/photo-1590674899484-d5640e57abe4?w=800&q=80"],
    amenities: {
      covered: true,
      evCharging: true,
      disabledAccess: true,
      cctv: true,
      valet: true,
      carWash: true,
    },
    hours: { is24Hours: false, openTime: "07:00", closeTime: "22:00", closedDays: [0] },
    slots: makeSlots("dq", 1, 20),
  },
  {
    id: "lot-5",
    name: "Boulevard Riyadh City — West",
    address: "Hittin, Riyadh",
    location: { lat: 24.78, lng: 46.59 },
    totalSlots: 150,
    availableSlots: 55,
    pricePerHour: 10,
    pricePerDay: 55,
    rating: 4.5,
    reviewCount: 203,
    photoUrls: ["https://images.unsplash.com/photo-1489515217757-5fd1be406fef?w=800&q=80"],
    amenities: {
      covered: true,
      evCharging: true,
      disabledAccess: true,
      cctv: true,
      valet: false,
      carWash: true,
    },
    hours: { is24Hours: false, openTime: "10:00", closeTime: "02:00", closedDays: [] },
    slots: makeSlots("blvd", 2, 20),
  },
].map((lot) => {
  const dist = Math.round(
    Math.sqrt(
      (lot.location.lat - RIYADH_CENTER.lat) ** 2 + (lot.location.lng - RIYADH_CENTER.lng) ** 2
    ) * 111000
  );
  const avail = lot.slots.filter((s) => s.status === "available").length;
  return { ...lot, distanceMeters: dist, availableSlots: avail, totalSlots: lot.slots.length };
});

export function getLotById(id: string): ParkingLot | undefined {
  return MOCK_LOTS.find((l) => l.id === id);
}

export function searchLots(query: string): ParkingLot[] {
  const q = query.trim().toLowerCase();
  if (!q) return MOCK_LOTS;
  return MOCK_LOTS.filter(
    (l) =>
      l.name.toLowerCase().includes(q) ||
      l.address.toLowerCase().includes(q) ||
      l.id.toLowerCase().includes(q)
  );
}
