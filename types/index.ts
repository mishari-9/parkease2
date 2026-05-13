export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Vehicle {
  id: string;
  plate: string;
  make: string;
  model: string;
  type: "sedan" | "suv" | "truck" | "motorcycle";
  color: string;
  isDefault: boolean;
}

export interface PaymentMethod {
  id: string;
  label: string;
  type: "card" | "apple_pay" | "stc_pay" | "mada";
  last4?: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatarUrl: string;
  language: "ar" | "en";
  vehicles: Vehicle[];
  paymentMethods: PaymentMethod[];
  savedLotIds: string[];
  createdAt: Date;
}

export interface LotAmenities {
  covered: boolean;
  evCharging: boolean;
  disabledAccess: boolean;
  cctv: boolean;
  valet: boolean;
  carWash: boolean;
}

export interface OpeningHours {
  is24Hours: boolean;
  openTime: string;
  closeTime: string;
  closedDays: number[];
}

export type SlotStatus = "available" | "occupied" | "reserved" | "maintenance";
export type SlotType = "standard" | "compact" | "disabled" | "ev";

export interface ParkingSlot {
  id: string;
  label: string;
  status: SlotStatus;
  type: SlotType;
  floor: number;
}

/** What this area is (surface, garage, faculty-only, etc.) — shown on map & detail. */
export type ParkingLotCategory = "surface" | "multi_storey" | "faculty" | "visitor" | "mixed";

export interface ParkingLot {
  id: string;
  name: string;
  address: string;
  /** Short label for map pins, e.g. "Visitor · Surface" */
  mapLabel?: string;
  category?: ParkingLotCategory;
  location: Coordinates;
  totalSlots: number;
  availableSlots: number;
  pricePerHour: number;
  pricePerDay: number;
  rating: number;
  reviewCount: number;
  photoUrls: string[];
  amenities: LotAmenities;
  hours: OpeningHours;
  slots: ParkingSlot[];
  distanceMeters?: number;
}

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "active"
  | "completed"
  | "cancelled";

export type PaymentMethodType = "card" | "apple_pay" | "stc_pay" | "mada";
export type PaymentStatus = "pending" | "paid" | "refunded" | "failed";

export interface Payment {
  id: string;
  baseAmount: number;
  serviceFee: number;
  totalAmount: number;
  method: PaymentMethodType;
  status: PaymentStatus;
  paidAt: Date | null;
}

export interface Review {
  id: string;
  userId: string;
  lotId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface Booking {
  id: string;
  userId: string;
  lotId: string;
  slotId: string;
  vehicleId: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  payment: Payment;
  qrCodeData: string;
  lot: ParkingLot;
  slot: ParkingSlot;
  review: Review | null;
  createdAt: string;
}

export interface SearchFilters {
  maxDistance: number;
  minPrice: number;
  maxPrice: number;
  covered: boolean;
  evCharging: boolean;
  disabledAccess: boolean;
  sortBy: "distance" | "price" | "rating";
  startTime: Date | null;
  endTime: Date | null;
}

export interface PriceBreakdown {
  hours: number;
  baseAmount: number;
  serviceFee: number;
  totalAmount: number;
}
