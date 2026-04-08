# 🚌 Raylane Express (RLX) — Full MVP v4

Uganda's first real-time bus & taxi booking platform.

## 🚀 Deploy to Vercel

```bash
# Method 1: CLI (fastest)
npm install
npx vercel --prod

# Method 2: GitHub import
# Push to GitHub → vercel.com → New Project → Import → Deploy

# Method 3: Local build
npm run build   # creates /dist
# Drag /dist to vercel.com
```

## 🛠 Local Development

```bash
npm install
npm run dev     # http://localhost:3000
```

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/          Navbar, Footer, MobileBottomNav
│   ├── sections/        All 10 homepage sections
│   └── ui/
│       ├── SharedComponents.jsx   ← SINGLE SOURCE OF TRUTH
│       │   Btn, Input, Select, Toggle, Card, StatCard, Pill
│       │   SectionHead, BarChart, ProgressBar, Modal, Banner
│       │   EmptyState, SeatLegend, PaymentModule, PaymentSuccess
│       │   BusSeat55, BusSeat65, BusSeat67, TaxiSeat14
│       ├── AIAssistant.jsx
│       └── ToastContainer.jsx
├── pages/
│   ├── Home.jsx
│   ├── BookingFlow.jsx      5-step: VehicleType→Search→Seats→Payment→Ticket
│   ├── ParcelPage.jsx       Send/Track/History + PaymentModule
│   ├── PartnerPortal.jsx    Apply/HowItWorks/Services/FAQ
│   ├── admin/AdminDashboard.jsx
│   └── operator/OperatorDashboard.jsx
├── data/index.js         Mock data (replace with API calls)
├── hooks/
│   ├── useToast.js
│   └── useMediaQuery.js
└── styles/globals.css   Mobile-first design system
```

## 🎨 Design System

| Token | Value |
|---|---|
| Primary Blue | `#0B3D91` |
| Gold Accent | `#FFC72C` |
| Font (Headings) | Montserrat 700–900 |
| Font (Body) | Inter 400–600 |
| Mobile breakpoint | 768px |
| Container max-width | 1200px |

## 💳 Payment Integration Points

Replace `PaymentModule` in `SharedComponents.jsx`:
- **MTN MoMo**: `https://developer.mtn.com/products/mobile-money`
- **Airtel Money**: `https://developers.airtel.africa`

## 🏦 Premium Services (Admin-activated)

| Service | Monthly Fee |
|---|---|
| Sacco Module | UGX 200,000 |
| Bank Loan Monitor | UGX 150,000 |
| Staff / HR Management | UGX 100,000 |
| Fleet Maintenance | UGX 120,000 |
| Fuel Management | UGX 80,000 |
| Insurance Dashboard | UGX 80,000 |
| Advanced Analytics | UGX 100,000 |
| Supplier & Vendor Pay | UGX 60,000 |

## 🔌 Backend Integration

Replace mock data in `src/data/index.js` with API calls.
Key endpoints to implement:
- `GET /trips?from=&to=&date=` — search trips
- `POST /bookings` — create booking
- `POST /payments/initiate` — trigger MoMo payment
- `GET /parcels/:id/track` — parcel tracking
- `GET /operators/:id/dashboard` — operator stats
- `POST /admin/payouts/:tripId/release` — manual payout

---
© 2026 Raylane Express Ltd · Kampala, Uganda 🇺🇬
