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

Data is **mock/local** (no backend required for the demo). Bookings persist in `localStorage` via Zustand.

## Scripts



## Deploy to Vercel

1. Push this repo to GitHub (see below).
2. In [Vercel](https://vercel.com): **New Project** → import `mishari-9/parkease2` (or your fork).
3. Framework preset: **Next.js**. Root directory: repo root. Build: `npm run build`, Output: default.
4. Deploy — no environment variables are required for the mock demo.

## Push to GitHub (`parkease2`)

From this folder (after [creating the empty repo](https://github.com/new) if needed):

```bash
git init
git add .
git commit -m "ParkEase web app: map, search, booking flow, Vercel-ready"
git branch -M main
git remote add origin https://github.com/mishari-9/parkease2.git
git push -u origin main
```

Use a [personal access token](https://github.com/settings/tokens) or GitHub CLI if HTTPS push asks for credentials.

## HCI / usability notes

- **Visibility**: Loading state on map, step indicator on booking, disabled pay until a method is chosen.
- **Errors**: Clear empty states (search, bookings, booking without slot).
- **Consistency**: Shared header, bottom navigation, primary actions in `pe-primary` blue.
- **Recognition**: Suggested chips on home search; saved lots on profile.

## License

Educational / HCI project (IT215).
