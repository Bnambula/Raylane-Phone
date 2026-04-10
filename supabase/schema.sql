-- ============================================================
-- RAYLANE EXPRESS — SUPABASE POSTGRESQL SCHEMA v1.0
-- Full ecosystem: Passengers · Operators · Fleet · Finance
-- Enable Row Level Security on every table
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─────────────────────────────────────────────
-- ENUMS
-- ─────────────────────────────────────────────
CREATE TYPE operator_type     AS ENUM ('INTERNAL','EXTERNAL');
CREATE TYPE operator_status   AS ENUM ('ACTIVE','SUSPENDED','PENDING');
CREATE TYPE trip_status       AS ENUM ('PENDING_APPROVAL','APPROVED','REJECTED','CANCELLED','COMPLETED');
CREATE TYPE booking_status    AS ENUM ('PENDING','CONFIRMED','CANCELLED','REFUNDED');
CREATE TYPE booking_type      AS ENUM ('STANDARD','ADVANCE','GROUP','CHARTER');
CREATE TYPE payout_status     AS ENUM ('READY','PROCESSING','RELEASED','FAILED');
CREATE TYPE parcel_status     AS ENUM ('PENDING','PICKUP','ENROUTE','DELIVERED','FAILED');
CREATE TYPE module_status     AS ENUM ('ACTIVE','INACTIVE');
CREATE TYPE payment_method    AS ENUM ('MTN_MOMO','AIRTEL_MONEY','CASH','BANK_TRANSFER');
CREATE TYPE seat_type         AS ENUM ('14','55','65','67');
CREATE TYPE vehicle_status    AS ENUM ('AVAILABLE','ON_ROUTE','MAINTENANCE','INACTIVE');
CREATE TYPE cost_category     AS ENUM ('FUEL','MAINTENANCE','STAFF','INSURANCE','PERMIT','LOAN','TAX','OTHER');
CREATE TYPE alert_type        AS ENUM ('URGENT','WARNING','INFO');
CREATE TYPE user_role         AS ENUM ('ADMIN','OPERATOR_ADMIN','DISPATCHER','ACCOUNTANT','LOADER');
CREATE TYPE invoice_status    AS ENUM ('PENDING','PAID','OVERDUE','CANCELLED');
CREATE TYPE application_status AS ENUM ('PENDING_REVIEW','APPROVED','REJECTED','INFO_REQUESTED');

-- ─────────────────────────────────────────────
-- PROFILES (extends Supabase auth.users)
-- ─────────────────────────────────────────────
CREATE TABLE profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name     TEXT,
  phone         TEXT UNIQUE,
  email         TEXT UNIQUE,
  avatar_url    TEXT,
  role          user_role DEFAULT 'DISPATCHER',
  operator_id   UUID,                   -- FK added after operators table
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- OPERATORS
-- ─────────────────────────────────────────────
CREATE TABLE operators (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name      TEXT NOT NULL,
  contact_name      TEXT NOT NULL,
  phone             TEXT NOT NULL,
  email             TEXT NOT NULL,
  operator_type     operator_type DEFAULT 'EXTERNAL',
  status            operator_status DEFAULT 'PENDING',
  is_premium        BOOLEAN DEFAULT FALSE,
  managed_by_raylane BOOLEAN DEFAULT FALSE,
  merchant_code     TEXT UNIQUE,           -- MTN MoMo merchant code
  momo_number       TEXT,                  -- fallback personal number
  commission_rate   NUMERIC(4,2) DEFAULT 8.00,  -- percentage e.g. 8.00
  fleet_size        INTEGER DEFAULT 0,
  boarding_lat      DOUBLE PRECISION,
  boarding_lng      DOUBLE PRECISION,
  boarding_label    TEXT,
  rating            NUMERIC(3,2) DEFAULT 0,
  review_count      INTEGER DEFAULT 0,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Add FK now that operators exists
ALTER TABLE profiles ADD CONSTRAINT fk_profiles_operator
  FOREIGN KEY (operator_id) REFERENCES operators(id) ON DELETE SET NULL;

-- ─────────────────────────────────────────────
-- OPERATOR MODULES
-- ─────────────────────────────────────────────
CREATE TABLE operator_modules (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  operator_id    UUID NOT NULL REFERENCES operators(id) ON DELETE CASCADE,
  module_name    TEXT NOT NULL,    -- 'booking_basic','financial_module', etc.
  status         module_status DEFAULT 'INACTIVE',
  price_ugx      INTEGER DEFAULT 0,
  activated_at   TIMESTAMPTZ,
  activated_by   UUID REFERENCES profiles(id),
  UNIQUE (operator_id, module_name)
);

-- ─────────────────────────────────────────────
-- VEHICLES
-- ─────────────────────────────────────────────
CREATE TABLE vehicles (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  operator_id       UUID NOT NULL REFERENCES operators(id) ON DELETE CASCADE,
  registration      TEXT NOT NULL UNIQUE,
  seat_type         seat_type NOT NULL,
  make_model        TEXT,
  year              INTEGER,
  status            vehicle_status DEFAULT 'AVAILABLE',
  fuel_percent      INTEGER DEFAULT 100,
  mileage_km        INTEGER DEFAULT 0,
  last_service_date DATE,
  next_service_date DATE,
  insurance_expiry  DATE,
  fitness_expiry    DATE,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- DRIVERS
-- ─────────────────────────────────────────────
CREATE TABLE drivers (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  operator_id       UUID NOT NULL REFERENCES operators(id) ON DELETE CASCADE,
  full_name         TEXT NOT NULL,
  phone             TEXT NOT NULL,
  licence_number    TEXT UNIQUE,
  licence_expiry    DATE,
  rating            NUMERIC(3,2) DEFAULT 0,
  trips_completed   INTEGER DEFAULT 0,
  is_active         BOOLEAN DEFAULT TRUE,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- ROUTES
-- ─────────────────────────────────────────────
CREATE TABLE routes (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_city     TEXT NOT NULL,
  to_city       TEXT NOT NULL,
  distance_km   INTEGER,
  est_hours     NUMERIC(4,1),
  is_active     BOOLEAN DEFAULT TRUE,
  UNIQUE (from_city, to_city)
);

-- ─────────────────────────────────────────────
-- TRIPS
-- ─────────────────────────────────────────────
CREATE TABLE trips (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  operator_id       UUID NOT NULL REFERENCES operators(id) ON DELETE CASCADE,
  vehicle_id        UUID REFERENCES vehicles(id),
  driver_id         UUID REFERENCES drivers(id),
  route_id          UUID REFERENCES routes(id),
  -- Denormalised for fast queries
  from_city         TEXT NOT NULL,
  to_city           TEXT NOT NULL,
  departure_date    DATE NOT NULL,
  departure_time    TIME NOT NULL,
  arrival_est       TIME,
  price_ugx         INTEGER NOT NULL,
  seats_total       INTEGER NOT NULL,
  seats_booked      INTEGER DEFAULT 0,
  seats_locked      INTEGER DEFAULT 0,    -- held during payment (5-min TTL)
  status            trip_status DEFAULT 'PENDING_APPROVAL',
  rejection_reason  TEXT,
  admin_note        TEXT,
  boarding_lat      DOUBLE PRECISION,
  boarding_lng      DOUBLE PRECISION,
  boarding_label    TEXT,
  amenities         TEXT[],               -- ['ac','wifi','usb']
  notes             TEXT,
  approved_by       UUID REFERENCES profiles(id),
  approved_at       TIMESTAMPTZ,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW(),
  -- Derived
  CONSTRAINT seats_valid CHECK (seats_booked + seats_locked <= seats_total)
);

CREATE INDEX idx_trips_status         ON trips(status);
CREATE INDEX idx_trips_operator       ON trips(operator_id);
CREATE INDEX idx_trips_from_to_date   ON trips(from_city, to_city, departure_date);
CREATE INDEX idx_trips_departure_date ON trips(departure_date);

-- ─────────────────────────────────────────────
-- BOOKINGS
-- ─────────────────────────────────────────────
CREATE TABLE bookings (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference          TEXT UNIQUE DEFAULT 'RLX-' || upper(substr(md5(random()::text), 1, 8)),
  trip_id            UUID NOT NULL REFERENCES trips(id),
  operator_id        UUID NOT NULL REFERENCES operators(id),
  passenger_phone    TEXT NOT NULL,
  payment_phone      TEXT,                -- if different from passenger
  seat_numbers       TEXT[],              -- e.g. ['5','12','13']
  amount_ugx         INTEGER NOT NULL,
  payment_method     payment_method DEFAULT 'MTN_MOMO',
  booking_type       booking_type DEFAULT 'STANDARD',
  commitment_fee_ugx INTEGER,             -- for ADVANCE bookings
  commitment_paid    BOOLEAN DEFAULT FALSE,
  status             booking_status DEFAULT 'PENDING',
  ticket_sent        BOOLEAN DEFAULT FALSE,
  qr_code            TEXT,                -- base64 or URL
  transaction_ref    TEXT,                -- MoMo transaction ID
  boarded            BOOLEAN DEFAULT FALSE,
  boarded_at         TIMESTAMPTZ,
  notes              TEXT,
  created_at         TIMESTAMPTZ DEFAULT NOW(),
  updated_at         TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_bookings_trip     ON bookings(trip_id);
CREATE INDEX idx_bookings_operator ON bookings(operator_id);
CREATE INDEX idx_bookings_phone    ON bookings(passenger_phone);
CREATE INDEX idx_bookings_status   ON bookings(status);

-- ─────────────────────────────────────────────
-- SEAT LOCKS (5-minute TTL for payment holds)
-- ─────────────────────────────────────────────
CREATE TABLE seat_locks (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id      UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  seat_numbers TEXT[] NOT NULL,
  phone        TEXT,
  locked_at    TIMESTAMPTZ DEFAULT NOW(),
  expires_at   TIMESTAMPTZ DEFAULT NOW() + INTERVAL '5 minutes',
  released     BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_seat_locks_trip    ON seat_locks(trip_id);
CREATE INDEX idx_seat_locks_expires ON seat_locks(expires_at);

-- Auto-cleanup expired locks (run via pg_cron or Supabase edge function)
-- SELECT cron.schedule('cleanup-seat-locks', '*/5 * * * *',
--   'DELETE FROM seat_locks WHERE expires_at < NOW() AND NOT released');

-- ─────────────────────────────────────────────
-- PAYOUTS
-- ─────────────────────────────────────────────
CREATE TABLE payouts (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id         UUID UNIQUE REFERENCES trips(id),
  operator_id     UUID NOT NULL REFERENCES operators(id),
  merchant_code   TEXT NOT NULL,
  gross_ugx       INTEGER NOT NULL,
  commission_ugx  INTEGER NOT NULL,
  net_ugx         INTEGER NOT NULL,
  commission_rate NUMERIC(4,2),
  status          payout_status DEFAULT 'READY',
  triggered_by    UUID REFERENCES profiles(id),
  triggered_at    TIMESTAMPTZ,
  momo_ref        TEXT,          -- MTN merchant payment reference
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- PARCELS
-- ─────────────────────────────────────────────
CREATE TABLE parcels (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tracking_id       TEXT UNIQUE DEFAULT 'PCL-' || upper(substr(md5(random()::text), 1, 10)),
  operator_id       UUID REFERENCES operators(id),
  trip_id           UUID REFERENCES trips(id),
  parcel_type       TEXT NOT NULL,        -- 'ENVELOPE','SMALL','LARGE','CARGO'
  from_city         TEXT NOT NULL,
  to_city           TEXT NOT NULL,
  sender_phone      TEXT NOT NULL,
  recipient_phone   TEXT NOT NULL,
  recipient_name    TEXT,
  declared_value    INTEGER,
  insured           BOOLEAN DEFAULT FALSE,
  insurance_fee     INTEGER DEFAULT 0,
  pickup_rider      BOOLEAN DEFAULT FALSE,
  amount_ugx        INTEGER NOT NULL,
  status            parcel_status DEFAULT 'PENDING',
  rider_id          UUID,
  notes             TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE parcel_events (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parcel_id   UUID NOT NULL REFERENCES parcels(id) ON DELETE CASCADE,
  label       TEXT NOT NULL,
  detail      TEXT,
  location    TEXT,
  scanned_by  UUID REFERENCES profiles(id),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- APPLICATIONS (operator onboarding)
-- ─────────────────────────────────────────────
CREATE TABLE applications (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  status             application_status DEFAULT 'PENDING_REVIEW',
  company_name       TEXT NOT NULL,
  contact_name       TEXT NOT NULL,
  phone              TEXT NOT NULL,
  email              TEXT NOT NULL,
  fleet_size         INTEGER,
  current_routes     TEXT,
  modules_requested  TEXT[],
  terms_accepted     BOOLEAN DEFAULT FALSE,
  signature_name     TEXT,
  rejection_reason   TEXT,
  reviewed_by        UUID REFERENCES profiles(id),
  reviewed_at        TIMESTAMPTZ,
  operator_id        UUID REFERENCES operators(id),  -- set on approval
  submitted_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- BANK LOANS
-- ─────────────────────────────────────────────
CREATE TABLE bank_loans (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  operator_id       UUID NOT NULL REFERENCES operators(id) ON DELETE CASCADE,
  bank_name         TEXT NOT NULL,
  principal_ugx     BIGINT NOT NULL,
  outstanding_ugx   BIGINT NOT NULL,
  monthly_ugx       INTEGER NOT NULL,
  next_due_date     DATE,
  months_paid       INTEGER DEFAULT 0,
  total_months      INTEGER NOT NULL,
  purpose           TEXT,
  status            TEXT DEFAULT 'CURRENT',  -- CURRENT, OVERDUE, REPAID
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- COST CENTER
-- ─────────────────────────────────────────────
CREATE TABLE cost_entries (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  operator_id  UUID NOT NULL REFERENCES operators(id) ON DELETE CASCADE,
  category     cost_category NOT NULL,
  vendor_id    UUID,                         -- FK below
  trip_id      UUID REFERENCES trips(id),
  vehicle_id   UUID REFERENCES vehicles(id),
  amount_ugx   INTEGER NOT NULL,
  description  TEXT NOT NULL,
  entry_date   DATE NOT NULL DEFAULT CURRENT_DATE,
  status       TEXT DEFAULT 'PAID',           -- PAID, PENDING, OVERDUE
  receipt_url  TEXT,
  created_by   UUID REFERENCES profiles(id),
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_costs_operator ON cost_entries(operator_id);
CREATE INDEX idx_costs_date     ON cost_entries(entry_date);

-- ─────────────────────────────────────────────
-- VENDORS
-- ─────────────────────────────────────────────
CREATE TABLE vendors (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  operator_id    UUID NOT NULL REFERENCES operators(id) ON DELETE CASCADE,
  name           TEXT NOT NULL,
  category       cost_category NOT NULL,
  contact_phone  TEXT,
  email          TEXT,
  credit_limit   INTEGER DEFAULT 0,
  balance_due    INTEGER DEFAULT 0,
  is_active      BOOLEAN DEFAULT TRUE,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE cost_entries ADD CONSTRAINT fk_costs_vendor
  FOREIGN KEY (vendor_id) REFERENCES vendors(id);

-- ─────────────────────────────────────────────
-- SAAS INVOICES (Raylane → Operators)
-- ─────────────────────────────────────────────
CREATE TABLE saas_invoices (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  operator_id   UUID NOT NULL REFERENCES operators(id) ON DELETE CASCADE,
  module_name   TEXT NOT NULL,
  amount_ugx    INTEGER NOT NULL,
  period        TEXT NOT NULL,       -- 'May 2026'
  due_date      DATE NOT NULL,
  status        invoice_status DEFAULT 'PENDING',
  paid_at       TIMESTAMPTZ,
  momo_ref      TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- NOTIFICATIONS
-- ─────────────────────────────────────────────
CREATE TABLE notifications (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipient_id UUID REFERENCES profiles(id),
  operator_id  UUID REFERENCES operators(id),  -- operator-level (not user)
  is_admin     BOOLEAN DEFAULT FALSE,
  type         TEXT NOT NULL,
  icon         TEXT,
  message      TEXT NOT NULL,
  link         TEXT,
  metadata     JSONB,
  is_read      BOOLEAN DEFAULT FALSE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifs_recipient ON notifications(recipient_id, is_read);
CREATE INDEX idx_notifs_operator  ON notifications(operator_id, is_read);
CREATE INDEX idx_notifs_admin     ON notifications(is_admin, is_read);

-- ─────────────────────────────────────────────
-- AUDIT LOG
-- ─────────────────────────────────────────────
CREATE TABLE audit_log (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action      TEXT NOT NULL,
  actor_id    UUID REFERENCES profiles(id),
  actor_label TEXT,      -- fallback name
  target_table TEXT,
  target_id   UUID,
  detail      TEXT,
  metadata    JSONB,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_created ON audit_log(created_at DESC);

-- ─────────────────────────────────────────────
-- REVIEWS / RATINGS
-- ─────────────────────────────────────────────
CREATE TABLE reviews (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id   UUID UNIQUE REFERENCES bookings(id),
  operator_id  UUID NOT NULL REFERENCES operators(id),
  trip_id      UUID REFERENCES trips(id),
  rating       INTEGER CHECK (rating BETWEEN 1 AND 5),
  comment      TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- LOYALTY POINTS
-- ─────────────────────────────────────────────
CREATE TABLE loyalty_points (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone       TEXT NOT NULL,
  points      INTEGER DEFAULT 0,
  tier        TEXT DEFAULT 'BRONZE',   -- BRONZE, SILVER, GOLD, PLATINUM
  lifetime    INTEGER DEFAULT 0,
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (phone)
);

CREATE TABLE loyalty_transactions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone       TEXT NOT NULL,
  booking_id  UUID REFERENCES bookings(id),
  points      INTEGER NOT NULL,        -- positive = earned, negative = redeemed
  reason      TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- SEED DATA — DEMO OPERATORS
-- ─────────────────────────────────────────────
INSERT INTO operators (id, company_name, contact_name, phone, email, operator_type, status,
  is_premium, managed_by_raylane, merchant_code, commission_rate, fleet_size,
  boarding_lat, boarding_lng, boarding_label, rating, review_count)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Raylane Express Fleet', 'Raylane Admin',
   '0700-000-000', 'fleet@raylaneexpress.com', 'INTERNAL', 'ACTIVE',
   TRUE, TRUE, 'RAYLANE_EXPRESS', 0, 3,
   0.3476, 32.5825, 'Raylane HQ, Kampala Coach Park', 5.0, 0),

  ('00000000-0000-0000-0000-000000000002', 'Global Coaches Ltd', 'John Ssemakula',
   '0771-234-567', 'info@globalcoaches.ug', 'EXTERNAL', 'ACTIVE',
   TRUE, FALSE, 'GLOBAL_UG', 8, 5,
   0.3476, 32.5825, 'Kampala Coach Park, Gate 3', 4.8, 312),

  ('00000000-0000-0000-0000-000000000003', 'YY Coaches', 'Yusuf Yasiin',
   '0700-345-678', 'yy@yycoaches.ug', 'EXTERNAL', 'ACTIVE',
   FALSE, FALSE, 'YY_COACHES', 8, 3,
   0.3489, 32.5814, 'New Taxi Park, Stand 7', 4.6, 208),

  ('00000000-0000-0000-0000-000000000004', 'Link Bus', 'Peter Ochieng',
   '0752-456-789', 'ops@linkbus.ug', 'EXTERNAL', 'ACTIVE',
   TRUE, FALSE, 'LINK_BUS_UG', 8, 8,
   0.3501, 32.5798, 'Namirembe Road Bus Park', 4.5, 189),

  ('00000000-0000-0000-0000-000000000005', 'Fast Coaches Ltd', 'Grace Auma',
   '0752-678-901', 'grace@fastcoaches.ug', 'EXTERNAL', 'ACTIVE',
   FALSE, FALSE, 'FAST_COACHES', 8, 4,
   0.3492, 32.5801, 'Nakivubo Bus Terminal, Bay 5', 4.3, 87);

-- ─────────────────────────────────────────────
-- SEED DATA — DEMO VEHICLES
-- ─────────────────────────────────────────────
INSERT INTO vehicles (operator_id, registration, seat_type, make_model, status, fuel_percent,
  insurance_expiry, fitness_expiry)
VALUES
  ('00000000-0000-0000-0000-000000000001','UBF 001K','55','Isuzu Giga 2022','ON_ROUTE',72,'2026-12-31','2026-09-30'),
  ('00000000-0000-0000-0000-000000000001','UBF 002K','67','Yutong ZK6127 2023','AVAILABLE',91,'2026-12-31','2026-08-15'),
  ('00000000-0000-0000-0000-000000000001','UBF 003K','14','Toyota Hiace 2021','MAINTENANCE',38,'2026-06-30','2026-07-01'),
  ('00000000-0000-0000-0000-000000000002','UAR 901J','55','Scania K-Series 2021','AVAILABLE',78,'2026-11-30','2026-10-15'),
  ('00000000-0000-0000-0000-000000000002','UAR 902J','67','King Long 6128 2022','AVAILABLE',65,'2026-11-30','2026-09-20'),
  ('00000000-0000-0000-0000-000000000003','UAK 512B','67','Higer KLQ6129 2020','AVAILABLE',55,'2026-08-31','2026-06-30'),
  ('00000000-0000-0000-0000-000000000004','UBJ 890C','65','Yutong ZK6117 2023','ON_ROUTE',62,'2026-10-31','2026-11-15');

-- ─────────────────────────────────────────────
-- SEED DATA — DEMO ROUTES
-- ─────────────────────────────────────────────
INSERT INTO routes (from_city, to_city, distance_km, est_hours) VALUES
  ('Kampala','Mbale',      231, 4.5),
  ('Kampala','Gulu',       337, 5.5),
  ('Kampala','Arua',       480, 8.0),
  ('Kampala','Mbarara',    289, 4.0),
  ('Kampala','Fort Portal', 310, 5.0),
  ('Kampala','Kabale',     415, 6.5),
  ('Kampala','Jinja',       81, 1.5),
  ('Kampala','Masaka',     135, 2.5),
  ('Kampala','Nairobi',    680, 10.0),
  ('Kampala','Kigali',     528, 9.0),
  ('Kampala','Juba',       1800,28.0),
  ('Mbale','Kampala',      231, 4.5),
  ('Gulu','Kampala',       337, 5.5),
  ('Mbarara','Kampala',    289, 4.0);

-- ─────────────────────────────────────────────
-- SEED DATA — DEMO TRIPS (live approved)
-- ─────────────────────────────────────────────
INSERT INTO trips (operator_id, from_city, to_city, departure_date, departure_time,
  price_ugx, seats_total, seats_booked, status, boarding_label, amenities, notes)
VALUES
  ('00000000-0000-0000-0000-000000000001','Kampala','Mbale',    CURRENT_DATE+1,'08:00','28000',55,22,'APPROVED','Raylane HQ, Gate 1',ARRAY['ac','wifi','usb'],'Premium Raylane direct service'),
  ('00000000-0000-0000-0000-000000000001','Kampala','Gulu',     CURRENT_DATE+1,'07:00','38000',67,31,'APPROVED','Raylane HQ, Gate 2',ARRAY['ac','usb'],'Express — no stops'),
  ('00000000-0000-0000-0000-000000000002','Kampala','Mbale',    CURRENT_DATE+1,'10:00','25000',55,36,'APPROVED','Kampala Coach Park, Gate 3',ARRAY['ac'],''),
  ('00000000-0000-0000-0000-000000000002','Kampala','Mbarara',  CURRENT_DATE+1,'09:00','30000',55,8, 'APPROVED','Kampala Coach Park, Gate 3',ARRAY['ac'],''),
  ('00000000-0000-0000-0000-000000000004','Kampala','Nairobi',  CURRENT_DATE+2,'06:00','65000',65,18,'APPROVED','Namirembe Road Bus Park',ARRAY['ac','wifi'],'Passport required'),
  ('00000000-0000-0000-0000-000000000004','Kampala','Kigali',   CURRENT_DATE+2,'05:30','60000',65,12,'APPROVED','Namirembe Road Bus Park',ARRAY['ac','wifi'],'Passport required'),
  ('00000000-0000-0000-0000-000000000003','Kampala','Gulu',     CURRENT_DATE+1,'07:00','35000',67,0, 'PENDING_APPROVAL','New Taxi Park, Stand 7',ARRAY[],'Direct route'),
  ('00000000-0000-0000-0000-000000000005','Kampala','Fort Portal',CURRENT_DATE+1,'09:30','35000',55,14,'APPROVED','Nakivubo Bus Terminal, Bay 5',ARRAY['ac'],'Scenic western route'),
  ('00000000-0000-0000-0000-000000000001','Mbale','Kampala',    CURRENT_DATE+1,'14:00','28000',55,12,'APPROVED','Mbale Bus Terminal',ARRAY['ac','usb'],'Afternoon return'),
  ('00000000-0000-0000-0000-000000000002','Kampala','Kabale',   CURRENT_DATE+3,'06:00','42000',55,5, 'APPROVED','Kampala Coach Park, Gate 3',ARRAY['ac'],'Via Mbarara');

-- ─────────────────────────────────────────────
-- SEED DATA — DEMO BOOKINGS
-- ─────────────────────────────────────────────
INSERT INTO bookings (trip_id, operator_id, passenger_phone, amount_ugx, payment_method, status, seat_numbers, ticket_sent)
SELECT
  t.id,
  t.operator_id,
  '0771-' || floor(random()*900000+100000)::text,
  t.price_ugx,
  (ARRAY['MTN_MOMO','AIRTEL_MONEY'])[floor(random()*2+1)::int]::"payment_method",
  'CONFIRMED',
  ARRAY[floor(random()*50+1)::text],
  TRUE
FROM trips t
WHERE t.status = 'APPROVED'
LIMIT 8;

-- ─────────────────────────────────────────────
-- ROW LEVEL SECURITY POLICIES
-- ─────────────────────────────────────────────
ALTER TABLE operators        ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips            ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings         ENABLE ROW LEVEL SECURITY;
ALTER TABLE cost_entries     ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications    ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log        ENABLE ROW LEVEL SECURITY;

-- Admins see everything
CREATE POLICY "admin_all" ON operators      FOR ALL USING (auth.jwt() ->> 'role' = 'ADMIN');
CREATE POLICY "admin_all" ON trips          FOR ALL USING (auth.jwt() ->> 'role' = 'ADMIN');
CREATE POLICY "admin_all" ON bookings       FOR ALL USING (auth.jwt() ->> 'role' = 'ADMIN');
CREATE POLICY "admin_all" ON cost_entries   FOR ALL USING (auth.jwt() ->> 'role' = 'ADMIN');
CREATE POLICY "admin_all" ON audit_log      FOR ALL USING (auth.jwt() ->> 'role' = 'ADMIN');

-- Operators see only their own data
CREATE POLICY "op_own_trips" ON trips FOR ALL
  USING (operator_id::text = auth.jwt() ->> 'operator_id');

CREATE POLICY "op_own_bookings" ON bookings FOR SELECT
  USING (operator_id::text = auth.jwt() ->> 'operator_id');

CREATE POLICY "op_own_costs" ON cost_entries FOR ALL
  USING (operator_id::text = auth.jwt() ->> 'operator_id');

-- Public can read APPROVED trips
CREATE POLICY "public_trips" ON trips FOR SELECT
  USING (status = 'APPROVED');

-- ─────────────────────────────────────────────
-- REALTIME SUBSCRIPTIONS (enable in Supabase dashboard)
-- Enables: trips, bookings, seat_locks, notifications
-- ─────────────────────────────────────────────
-- ALTER PUBLICATION supabase_realtime ADD TABLE trips;
-- ALTER PUBLICATION supabase_realtime ADD TABLE bookings;
-- ALTER PUBLICATION supabase_realtime ADD TABLE seat_locks;
-- ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- ─────────────────────────────────────────────
-- FUNCTIONS
-- ─────────────────────────────────────────────

-- Increment seats_booked when booking confirmed
CREATE OR REPLACE FUNCTION increment_seats_booked()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'CONFIRMED' AND OLD.status != 'CONFIRMED' THEN
    UPDATE trips SET seats_booked = seats_booked + array_length(NEW.seat_numbers,1)
    WHERE id = NEW.trip_id;
  END IF;
  IF NEW.status = 'CANCELLED' AND OLD.status = 'CONFIRMED' THEN
    UPDATE trips SET seats_booked = GREATEST(0, seats_booked - array_length(OLD.seat_numbers,1))
    WHERE id = NEW.trip_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_seats_booked
  AFTER UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION increment_seats_booked();

-- Auto-create payout record when trip is APPROVED
CREATE OR REPLACE FUNCTION auto_create_payout()
RETURNS TRIGGER AS $$
DECLARE
  op operators%ROWTYPE;
BEGIN
  IF NEW.status = 'APPROVED' AND OLD.status != 'APPROVED' THEN
    SELECT * INTO op FROM operators WHERE id = NEW.operator_id;
    INSERT INTO payouts (trip_id, operator_id, merchant_code, gross_ugx, commission_ugx, net_ugx, commission_rate)
    VALUES (
      NEW.id, NEW.operator_id, COALESCE(op.merchant_code, op.momo_number),
      NEW.price_ugx * NEW.seats_booked,
      ROUND((NEW.price_ugx * NEW.seats_booked * op.commission_rate / 100)),
      ROUND((NEW.price_ugx * NEW.seats_booked * (100 - op.commission_rate) / 100)),
      op.commission_rate
    )
    ON CONFLICT (trip_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_auto_payout
  AFTER UPDATE ON trips
  FOR EACH ROW EXECUTE FUNCTION auto_create_payout();

-- Auto-update operator rating after review
CREATE OR REPLACE FUNCTION update_operator_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE operators SET
    rating = (SELECT ROUND(AVG(rating)::numeric, 2) FROM reviews WHERE operator_id = NEW.operator_id),
    review_count = (SELECT COUNT(*) FROM reviews WHERE operator_id = NEW.operator_id)
  WHERE id = NEW.operator_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_operator_rating
  AFTER INSERT OR UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_operator_rating();

