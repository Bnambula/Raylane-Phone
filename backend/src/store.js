const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

// ── IN-MEMORY STORE ─────────────────────────────────────────────
// Replace with PostgreSQL/MongoDB in production

const store = {
  users: [],
  operators: [],
  trips: [],
  bookings: [],
  payments: [],
  parcels: [],
  seats: {},       // { tripId: { seatNum: { status, lockedBy, lockedUntil } } }
  modules: [],
  alerts: [],
  payouts: []
};

// ── SEED DATA ───────────────────────────────────────────────────
const seed = async () => {
  const adminPw = await bcrypt.hash('admin123', 10);
  const opPw    = await bcrypt.hash('operator123', 10);

  store.users.push(
    { id: 'admin-001', email: 'admin@raylane.ug', password: adminPw, role: 'admin', name: 'Raylane Admin', createdAt: new Date() },
    { id: 'op-user-001', email: 'gaaga@buses.ug', password: opPw, role: 'operator', operatorId: 'op-001', name: 'Moses Gaaga', createdAt: new Date() },
    { id: 'op-user-002', email: 'link@buses.ug', password: opPw, role: 'operator', operatorId: 'op-002', name: 'Sarah Link', createdAt: new Date() }
  );

  store.operators.push(
    {
      id: 'op-001', name: 'Gaaga Bus Services', email: 'gaaga@buses.ug',
      phone: '+256701234567', status: 'ACTIVE', managedByRaylane: false,
      modules: ['TRIPS','SEAT_MANAGEMENT','BOOKINGS','PARCELS'],
      merchantCode: 'GAAGA001', balance: 2340000, commission: 8,
      createdAt: new Date('2024-01-15')
    },
    {
      id: 'op-002', name: 'Link Bus Company', email: 'link@buses.ug',
      phone: '+256702345678', status: 'ACTIVE', managedByRaylane: false,
      modules: ['TRIPS','SEAT_MANAGEMENT','BOOKINGS','PARCELS','FINANCIAL','ANALYTICS'],
      merchantCode: 'LINK002', balance: 1820000, commission: 8,
      createdAt: new Date('2024-02-10')
    },
    {
      id: 'op-003', name: 'Rapid Connect Ltd', email: 'rapid@buses.ug',
      phone: '+256703456789', status: 'PENDING', managedByRaylane: false,
      modules: [], merchantCode: '', balance: 0, commission: 8,
      createdAt: new Date('2024-04-01')
    }
  );

  const routes = [
    { from: 'Kampala', to: 'Mbale', price: 25000, duration: '4h 30m' },
    { from: 'Kampala', to: 'Gulu', price: 35000, duration: '5h' },
    { from: 'Kampala', to: 'Mbarara', price: 22000, duration: '3h 30m' },
    { from: 'Kampala', to: 'Jinja', price: 12000, duration: '1h 30m' },
    { from: 'Kampala', to: 'Masaka', price: 15000, duration: '2h' },
    { from: 'Mbale', to: 'Kampala', price: 25000, duration: '4h 30m' },
  ];

  const vehicles = ['UBB 123A', 'UBC 456B', 'UAA 789C', 'UBD 012D'];
  const now = new Date();

  routes.forEach((r, i) => {
    const tripDate = new Date(now);
    tripDate.setDate(now.getDate() + (i % 5));
    const tripId = `trip-${String(i+1).padStart(3,'0')}`;
    const operatorId = i < 3 ? 'op-001' : 'op-002';
    const totalSeats = 49;

    store.trips.push({
      id: tripId,
      operatorId,
      from: r.from, to: r.to,
      departureTime: `${tripDate.toISOString().split('T')[0]}T${String(6 + i*2).padStart(2,'0')}:00:00`,
      price: r.price, duration: r.duration,
      vehicle: vehicles[i % vehicles.length],
      totalSeats, bookedSeats: Math.floor(Math.random() * 20),
      status: i === 0 ? 'PENDING' : 'LIVE',
      vehicleType: i % 3 === 0 ? 'MINI_BUS' : 'COACH',
      amenities: ['WiFi', 'AC', 'USB Charging'].slice(0, (i % 3) + 1),
      createdAt: new Date()
    });

    // Init seats
    store.seats[tripId] = {};
    for (let s = 1; s <= totalSeats; s++) {
      store.seats[tripId][s] = { status: 'AVAILABLE', lockedBy: null, lockedUntil: null };
    }
    // Mark some as booked
    for (let b = 1; b <= Math.floor(Math.random() * 15); b++) {
      store.seats[tripId][b] = { status: 'BOOKED', lockedBy: null, lockedUntil: null };
    }
  });

  store.bookings.push(
    {
      id: 'BK-001', tripId: 'trip-002', passengerId: null, passengerName: 'Alice Nakato',
      passengerPhone: '+256770111222', seatNumber: 5, status: 'CONFIRMED',
      amount: 35000, paymentMethod: 'MTN_MOMO', ticketCode: 'RL-A1B2-C3D4',
      createdAt: new Date('2024-04-01')
    },
    {
      id: 'BK-002', tripId: 'trip-002', passengerId: null, passengerName: 'John Ssemakula',
      passengerPhone: '+256780222333', seatNumber: 12, status: 'CONFIRMED',
      amount: 35000, paymentMethod: 'AIRTEL_MOMO', ticketCode: 'RL-E5F6-G7H8',
      createdAt: new Date('2024-04-01')
    }
  );

  store.payments.push(
    { id: 'pay-001', bookingId: 'BK-001', amount: 35000, commission: 2800, operatorNet: 32200, status: 'HELD', method: 'MTN_MOMO', createdAt: new Date() },
    { id: 'pay-002', bookingId: 'BK-002', amount: 35000, commission: 2800, operatorNet: 32200, status: 'HELD', method: 'AIRTEL_MOMO', createdAt: new Date() }
  );

  store.alerts.push(
    { id: 'alert-001', type: 'APPROVAL', message: 'New trip pending approval from Gaaga Bus Services', read: false, createdAt: new Date() },
    { id: 'alert-002', type: 'OPERATOR', message: 'New operator application: Rapid Connect Ltd', read: false, createdAt: new Date() },
    { id: 'alert-003', type: 'FINANCIAL', message: 'Payment held for Trip trip-002 — 2 passengers', read: true, createdAt: new Date() }
  );
};

seed().then(() => console.log('✅ Seed data loaded'));

// ── SEAT LOCK CLEANUP ────────────────────────────────────────────
setInterval(() => {
  const now = Date.now();
  Object.values(store.seats).forEach(tripSeats => {
    Object.entries(tripSeats).forEach(([num, seat]) => {
      if (seat.status === 'LOCKED' && seat.lockedUntil && now > new Date(seat.lockedUntil).getTime()) {
        tripSeats[num] = { status: 'AVAILABLE', lockedBy: null, lockedUntil: null };
      }
    });
  });
}, 10000);

module.exports = store;
