# ParkEase (Web)

Smart parking finder demo — **Next.js 14** + TypeScript + Tailwind, styled for a clear civic experience similar in spirit to [Riyadh Parking](https://www.riyadhparking.sa/en). Deploys cleanly on **Vercel**.

## Features

- **Map** (`/`) — OpenStreetMap + Leaflet markers; tap a lot for a slide-up card with **View details** and **Navigate** (Google Maps).
- **Search** (`/search`) — Query lots by name or area; every result links to a real lot page.
- **Lot detail** (`/lots/[id]`) — Photos, floors, slot grid, **Reserve** → booking wizard.
- **Booking** (`/book/[lotId]`) — Four steps (time, vehicle, review, payment) with live price (5% service fee).
- **Confirmation** (`/confirmation/[bookingId]`) — QR code + summary + map link.
- **Bookings** (`/bookings`) — Upcoming / past / cancelled; cancel on upcoming.
- **Profile** (`/profile`) — Vehicles, saved lots, EN/AR toggle (RTL layout), notifications toggle.


