"use client";

import { useMemo, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import Link from "next/link";
import type { ParkingLot } from "@/types";
import { colors } from "@/constants/colors";

// Fix Leaflet default icon paths for bundled apps (Next.js / Webpack)
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src,
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
});

function InvalidateOnMount() {
  const map = useMap();
  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 200);
    return () => clearTimeout(t);
  }, [map]);
  return null;
}

function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function pinState(lot: ParkingLot): "ok" | "low" | "full" {
  if (lot.availableSlots === 0) return "full";
  if (lot.availableSlots <= 4) return "low";
  return "ok";
}

function pinColor(lot: ParkingLot) {
  const s = pinState(lot);
  if (s === "full") return colors.slotFull;
  if (s === "low") return colors.slotLow;
  return colors.slotFree;
}

function buildLotIcon(lot: ParkingLot) {
  const state = pinState(lot);
  const title = lot.name.length > 26 ? `${lot.name.slice(0, 24)}…` : lot.name;
  const label = esc(lot.mapLabel ?? "QU · CoC");
  const head = esc(title);
  const price = lot.pricePerHour;
  const free = lot.availableSlots;
  const tot = lot.totalSlots;
  const bg = pinColor(lot);
  return L.divIcon({
    className: "pe-pin-root",
    html: `
      <div class="pe-pin pe-pin--${state}" style="--pin-bg:${bg}">
        <div class="pe-pin__head">${head}</div>
        <div class="pe-pin__row"><span class="pe-pin__price">SAR ${price}</span><span class="pe-pin__per">/hr</span></div>
        <div class="pe-pin__avail">${free}/${tot} free</div>
        <div class="pe-pin__kind">${label}</div>
      </div>
    `,
    iconSize: [112, 96],
    iconAnchor: [56, 88],
    popupAnchor: [0, -82],
  });
}

type Props = {
  lots: ParkingLot[];
  center: [number, number];
  zoom?: number;
  onSelectLot?: (lot: ParkingLot) => void;
  darkTiles?: boolean;
};

export default function LeafletMap({
  lots,
  center,
  zoom = 16,
  onSelectLot,
  darkTiles,
}: Props) {
  const tileUrl = darkTiles
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  const attribution = darkTiles
    ? '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> · <a href="https://carto.com/">CARTO</a>'
    : '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>';

  const icons = useMemo(() => {
    const m = new Map<string, L.DivIcon>();
    for (const lot of lots) {
      m.set(lot.id, buildLotIcon(lot));
    }
    return m;
  }, [lots]);

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className="h-full w-full min-h-[280px] rounded-2xl z-0"
      scrollWheelZoom
    >
      <InvalidateOnMount />
      <TileLayer attribution={attribution} url={tileUrl} />
      {lots.map((lot) => (
        <Marker
          key={lot.id}
          position={[lot.location.lat, lot.location.lng]}
          icon={icons.get(lot.id) ?? buildLotIcon(lot)}
          eventHandlers={{
            click: () => onSelectLot?.(lot),
          }}
        >
          <Popup>
            <div className="min-w-[200px] space-y-1 p-0.5 text-slate-900 dark:text-slate-100">
              <p className="text-sm font-bold leading-snug">{lot.name}</p>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {lot.mapLabel ?? ""}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {lot.address}
              </p>
              <p className="pt-1 text-sm font-semibold text-pe-primary">
                SAR {lot.pricePerHour}/hr · {lot.availableSlots}/
                {lot.totalSlots} free
              </p>
              <Link
                href={`/lots/${lot.id}`}
                className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-pe-primary py-2 text-center text-xs font-bold text-white"
              >
                View details & reserve
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
