"use client";

import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";
import Link from "next/link";
import type { ParkingLot } from "@/types";
import { colors } from "@/constants/colors";

function InvalidateOnMount() {
  const map = useMap();
  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 200);
    return () => clearTimeout(t);
  }, [map]);
  return null;
}

function pinColor(lot: ParkingLot) {
  if (lot.availableSlots > 5) return colors.slotFree;
  if (lot.availableSlots > 0) return colors.slotLow;
  return colors.slotFull;
}

type Props = {
  lots: ParkingLot[];
  center: [number, number];
  zoom?: number;
  onSelectLot?: (lot: ParkingLot) => void;
};

export default function LeafletMap({ lots, center, zoom = 12, onSelectLot }: Props) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className="h-full w-full min-h-[320px] rounded-2xl z-0"
      scrollWheelZoom
    >
      <InvalidateOnMount />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {lots.map((lot) => (
        <CircleMarker
          key={lot.id}
          center={[lot.location.lat, lot.location.lng]}
          eventHandlers={{
            click: () => onSelectLot?.(lot),
          }}
          pathOptions={{
            color: "#fff",
            weight: 2,
            fillColor: pinColor(lot),
            fillOpacity: 0.95,
          }}
          radius={14}
        >
          <Popup>
            <div className="min-w-[160px] p-1">
              <p className="font-semibold text-slate-900">{lot.name}</p>
              <p className="text-xs text-slate-500">
                {lot.availableSlots} free · SAR {lot.pricePerHour}/hr
              </p>
              <Link
                href={`/lots/${lot.id}`}
                className="mt-2 inline-flex rounded-lg bg-pe-primary px-3 py-1.5 text-xs font-semibold text-white"
              >
                View details
              </Link>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
