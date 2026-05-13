import type { ParkingLot, ParkingSlot, ParkingLotCategory } from "@/types";
import { QASSIM_COLLEGE_OF_COMPUTER, offsetMeters } from "@/lib/qassimCampus";
import { haversineDistance } from "@/lib/calculateDistance";

const CAMPUS = QASSIM_COLLEGE_OF_COMPUTER;

/** High-res, stable Unsplash assets (parking / campus). */
const IMG = {
  garage:
    "https://images.unsplash.com/photo-1506521781263-d8422e82f57a?auto=format&fit=crop&w=1600&q=90",
  campus:
    "https://images.unsplash.com/photo-1523050854058-8df90110d9f1?auto=format&fit=crop&w=1600&q=90",
  outdoor:
    "https://images.unsplash.com/photo-1573348722427-f0766824bcdc?auto=format&fit=crop&w=1600&q=90",
  night:
    "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1600&q=90",
  lines:
    "https://images.unsplash.com/photo-1621929747188-9b2c9d7d9e1c?auto=format&fit=crop&w=1600&q=90",
  modern:
    "https://images.unsplash.com/photo-1545175701-4f729f383c9d?auto=format&fit=crop&w=1600&q=90",
};

function makeSlots(
  prefix: string,
  floors: number,
  perFloor: number,
  availability: "generous" | "tight" | "full"
): ParkingSlot[] {
  const slots: ParkingSlot[] = [];
  let i = 0;
  for (let f = 1; f <= floors; f++) {
    for (let n = 1; n <= perFloor; n++) {
      i++;
      let status: ParkingSlot["status"];
      if (availability === "full") {
        status = i % 9 === 0 ? "maintenance" : "occupied";
      } else if (availability === "tight") {
        const r = i % 5;
        status = r === 0 ? "maintenance" : r === 1 ? "occupied" : r === 2 ? "reserved" : "available";
      } else {
        const r = i % 6;
        status = r === 0 ? "maintenance" : r === 1 ? "occupied" : r === 2 ? "reserved" : "available";
      }
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

function lotBase(
  id: string,
  name: string,
  address: string,
  mapLabel: string,
  category: ParkingLotCategory,
  offsetNorth: number,
  offsetEast: number,
  pricePerHour: number,
  pricePerDay: number,
  rating: number,
  reviewCount: number,
  photoUrls: string[],
  slotPreset: "generous" | "tight" | "full",
  floors: number,
  perFloor: number,
  amenities: ParkingLot["amenities"]
): Omit<ParkingLot, "distanceMeters" | "availableSlots" | "totalSlots"> {
  const loc = offsetMeters(CAMPUS.lat, CAMPUS.lng, offsetNorth, offsetEast);
  return {
    id,
    name,
    address,
    mapLabel,
    category,
    location: loc,
    pricePerHour,
    pricePerDay,
    rating,
    reviewCount,
    photoUrls,
    amenities,
    hours: { is24Hours: false, openTime: "07:00", closeTime: "22:00", closedDays: [5] },
    slots: makeSlots(id.replace(/-/g, ""), floors, perFloor, slotPreset),
  };
}

const raw: Omit<ParkingLot, "distanceMeters" | "availableSlots" | "totalSlots">[] = [
  lotBase(
    "qu-coc-main",
    "College of Computer — Main visitor lot",
    "Qassim University, College of Computer, Buraydah",
    "Visitor · Surface",
    "visitor",
    40,
    -80,
    3,
    18,
    4.7,
    86,
    [IMG.outdoor, IMG.lines],
    "generous",
    1,
    24,
    {
      covered: false,
      evCharging: false,
      disabledAccess: true,
      cctv: true,
      valet: false,
      carWash: false,
    }
  ),
  lotBase(
    "qu-coc-garage",
    "CoC Multi-storey garage (P1)",
    "Adjacent to College of Computer, QU",
    "Garage · Mixed",
    "multi_storey",
    -20,
    120,
    5,
    28,
    4.8,
    142,
    [IMG.garage, IMG.night],
    "tight",
    2,
    14,
    {
      covered: true,
      evCharging: true,
      disabledAccess: true,
      cctv: true,
      valet: false,
      carWash: false,
    }
  ),
  lotBase(
    "qu-coc-faculty",
    "CoC Faculty & staff parking",
    "North side, College of Computer, QU",
    "Faculty · Surface",
    "faculty",
    140,
    -40,
    2,
    12,
    4.5,
    52,
    [IMG.campus, IMG.modern],
    "generous",
    1,
    18,
    {
      covered: false,
      evCharging: true,
      disabledAccess: true,
      cctv: true,
      valet: false,
      carWash: false,
    }
  ),
  lotBase(
    "qu-coc-east",
    "CoC East ring — student bays",
    "East walkway, College of Computer, QU",
    "Student · Surface",
    "surface",
    -60,
    200,
    2.5,
    15,
    4.4,
    201,
    [IMG.lines, IMG.outdoor],
    "generous",
    1,
    30,
    {
      covered: false,
      evCharging: false,
      disabledAccess: true,
      cctv: true,
      valet: false,
      carWash: false,
    }
  ),
  lotBase(
    "qu-coc-ev",
    "EV priority deck — CoC",
    "Garage level B, College of Computer, QU",
    "EV · Covered",
    "mixed",
    30,
    -180,
    6,
    32,
    4.9,
    33,
    [IMG.modern, IMG.garage],
    "tight",
    1,
    12,
    {
      covered: true,
      evCharging: true,
      disabledAccess: true,
      cctv: true,
      valet: false,
      carWash: false,
    }
  ),
  lotBase(
    "qu-coc-south",
    "South plaza temporary parking",
    "South plaza, College of Computer, QU",
    "Temporary · Surface",
    "surface",
    -200,
    60,
    2,
    10,
    4.2,
    67,
    [IMG.outdoor],
    "tight",
    1,
    16,
    {
      covered: false,
      evCharging: false,
      disabledAccess: false,
      cctv: true,
      valet: false,
      carWash: false,
    }
  ),
  lotBase(
    "qu-coc-service",
    "Service & delivery bay (CoC)",
    "Service road, College of Computer, QU",
    "Service · Limited",
    "mixed",
    80,
    220,
    4,
    22,
    4.0,
    19,
    [IMG.campus],
    "full",
    1,
    8,
    {
      covered: false,
      evCharging: false,
      disabledAccess: false,
      cctv: true,
      valet: false,
      carWash: false,
    }
  ),
];

export const MOCK_LOTS: ParkingLot[] = raw.map((lot) => {
  const avail = lot.slots.filter((s) => s.status === "available").length;
  const dist = Math.round(haversineDistance(CAMPUS, lot.location));
  return {
    ...lot,
    totalSlots: lot.slots.length,
    availableSlots: avail,
    distanceMeters: dist,
  };
});

export const QASSIM_SEARCH_HINTS = [
  "qassim",
  "qu",
  "computer",
  "coc",
  "college",
  "buraydah",
  "القصيم",
  "حاسب",
  "جامعة",
];

export function getLotById(id: string): ParkingLot | undefined {
  return MOCK_LOTS.find((l) => l.id === id);
}

export function searchLots(query: string): ParkingLot[] {
  const q = query.trim().toLowerCase();
  if (!q) return MOCK_LOTS;
  return MOCK_LOTS.filter((l) => {
    const blob = [
      l.name,
      l.address,
      l.mapLabel,
      l.id,
      l.category,
      "qassim university",
      "college of computer",
    ]
      .join(" ")
      .toLowerCase();
    return blob.includes(q);
  });
}

export function campusCenter(): { lat: number; lng: number } {
  return { lat: CAMPUS.lat, lng: CAMPUS.lng };
}
