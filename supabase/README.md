# Raylane Express — Supabase Integration Guide

## 1. Create your project
1. Go to https://supabase.com → New Project
2. Region: choose closest to Uganda (East Africa → use Frankfurt as nearest)
3. Generate a strong DB password and save it

## 2. Run the schema
In Supabase Dashboard → SQL Editor → New query → paste `schema.sql` → Run

## 3. Configure environment variables
Create `.env.local` in project root:
```
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```
Both values are in: Supabase Dashboard → Settings → API

## 4. Enable Realtime
Dashboard → Database → Replication → Enable for:
- `trips` (seat availability sync)
- `bookings` (booking confirmations)
- `seat_locks` (5-min TTL holds)
- `notifications` (live alerts)

## 5. Set up Row Level Security
Already defined in schema.sql. Verify in:
Dashboard → Authentication → Policies

## 6. SMS Integration (Africa's Talking)
```env
VITE_AT_USERNAME=your_username
VITE_AT_API_KEY=your_key
VITE_AT_SENDER_ID=RAYLANE
```
Used for: ticket delivery, OTP, payment confirmations, delay alerts

## 7. Mobile Money (MTN Uganda)
```env
VITE_MTN_API_URL=https://sandbox.momodeveloper.mtn.com
VITE_MTN_SUBSCRIPTION_KEY=your_key
VITE_MTN_API_USER=your_user_id
```

## 8. Key tables & relationships
```
operators (1) ──< operator_modules (many)
operators (1) ──< vehicles (many)
operators (1) ──< drivers (many)
operators (1) ──< trips (many)
trips     (1) ──< bookings (many)
trips     (1) ──  payouts (1)
operators (1) ──< cost_entries (many)
operators (1) ──< vendors (many)
operators (1) ──< bank_loans (many)
operators (1) ──< saas_invoices (many)
bookings  (1) ──< parcel_events (many) [for parcels]
```

## 9. Supabase client usage
```js
import { db } from './src/services/supabase'

// Get all live approved trips
const trips = await db.liveTrips('Kampala', 'Mbale')

// Create a booking
const booking = await db.bookings({ insert: { trip_id, operator_id, ... } })

// Subscribe to seat changes in real-time
import { subscribeToTable } from './src/services/supabase'
const unsub = subscribeToTable('trips', (payload) => {
  // Update seats_booked in UI
  console.log('Seat update:', payload)
})
// cleanup: unsub()
```

## 10. Cron jobs (Supabase Edge Functions)
- `cleanup-seat-locks`: every 5 minutes — release expired 5-min seat holds
- `send-departure-reminders`: every 30 minutes — SMS passengers 30 mins before departure
- `overdue-loan-alerts`: daily 9 AM — flag overdue bank loan repayments
- `generate-monthly-invoices`: 1st of each month — create SaaS subscription invoices

