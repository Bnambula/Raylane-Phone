# Raylane Express — MVP Deployment Guide

## 🏗️ Architecture Overview
```
raylane-backend/   → Deploy to Render.com (Node.js/Express)
raylane-frontend/  → Deploy to Vercel (React)
```

---

## 🚀 BACKEND — Deploy to Render

1. Push `raylane-backend/` to a GitHub repository
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect your GitHub repo
4. Settings:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
5. Add Environment Variables:
   - `JWT_SECRET` → any long random string
   - `NODE_ENV` → `production`
   - `FRONTEND_URL` → your Vercel URL (after deploying frontend)
6. Deploy — note your Render URL (e.g. `https://raylane-api.onrender.com`)

---

## 🌐 FRONTEND — Deploy to Vercel

1. Push `raylane-frontend/` to a GitHub repository
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import your repo
4. Settings:
   - **Framework Preset**: Create React App
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
5. Add Environment Variable:
   - `REACT_APP_API_URL` → your Render backend URL
6. Deploy

---

## 🔑 Demo Login Credentials

| Role     | Email                  | Password     |
|----------|------------------------|--------------|
| Admin    | admin@raylane.ug       | admin123     |
| Operator | gaaga@buses.ug         | operator123  |
| Operator | link@buses.ug          | operator123  |

---

## 📱 Portal URLs

| Portal    | URL            | Access          |
|-----------|----------------|-----------------|
| Passenger | `/`            | Public          |
| Operator  | `/operator`    | Operator login  |
| Admin     | `/admin`       | Admin login     |
| Login     | `/login`       | All staff       |

---

## 🔄 Core System Flows (Implemented)

### Passenger Booking Flow
1. Home → Search trips
2. Select trip → Live seat map
3. Lock seat (5-min server timer)
4. Enter details → Choose payment
5. Simulated payment → Confirm booking
6. QR code e-ticket generated

### Operator Flow
1. Login → Dashboard overview
2. Create trip → Submitted for admin approval
3. View bookings → Confirm boarding
4. Manage seats manually
5. View financial reports (if module active)

### Admin Flow
1. Login → Control center
2. Approve/reject trips and operators
3. Manage module access per operator
4. Monitor all bookings and payments
5. Release payouts to operators (per trip)
6. Monitor alerts inbox

---

## 🏦 Financial Rules (Implemented)
- **8% commission** deducted from every payment
- Operator balance **held** until admin releases
- **One payout per trip** (enforced)
- Only to **registered merchant code**

---

## 💎 Module System
Modules activated by admin per operator:
- `TRIPS` — Create and manage trips
- `SEAT_MANAGEMENT` — Live seat control
- `BOOKINGS` — Passenger management
- `PARCELS` — Parcel handling
- `FINANCIAL` — Financial reports (premium)
- `FUEL` — Fuel tracking (premium)
- `LOANS` — Loan monitoring (premium)
- `HR` — Staff management (premium)
- `ANALYTICS` — Route analytics (premium)

---

## 🛠️ Production Upgrades (Recommended)
- Replace in-memory store with **PostgreSQL** (use Supabase or Render Postgres)
- Add real **MTN/Airtel Mobile Money API** integration
- Add **WebSocket** for real-time seat updates
- Add **SMS notifications** via Africa's Talking
- Add **image uploads** for operator documents
- Implement **SACCO module** financial system
