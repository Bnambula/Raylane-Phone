const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const store = require('../store');
const { auth, requireAdmin, requireOperator } = require('../middleware/auth');

// Public: search trips
router.get('/search', (req, res) => {
  const { from, to, date, vehicleType } = req.query;
  let trips = store.trips.filter(t => t.status === 'LIVE');
  if (from) trips = trips.filter(t => t.from.toLowerCase().includes(from.toLowerCase()));
  if (to)   trips = trips.filter(t => t.to.toLowerCase().includes(to.toLowerCase()));
  if (date) trips = trips.filter(t => t.departureTime.startsWith(date));
  if (vehicleType) trips = trips.filter(t => t.vehicleType === vehicleType);

  const enriched = trips.map(t => {
    const op = store.operators.find(o => o.id === t.operatorId);
    const seats = store.seats[t.id] || {};
    const available = Object.values(seats).filter(s => s.status === 'AVAILABLE').length;
    return { ...t, operatorName: op?.name, availableSeats: available };
  });
  res.json(enriched);
});

// Public: get single trip
router.get('/:id', (req, res) => {
  const trip = store.trips.find(t => t.id === req.params.id);
  if (!trip) return res.status(404).json({ error: 'Trip not found' });
  const op = store.operators.find(o => o.id === trip.operatorId);
  const seats = store.seats[trip.id] || {};
  const available = Object.values(seats).filter(s => s.status === 'AVAILABLE').length;
  res.json({ ...trip, operatorName: op?.name, availableSeats: available });
});

// Operator: get own trips
router.get('/', auth, requireOperator, (req, res) => {
  const { operatorId, role } = req.user;
  const trips = role === 'admin'
    ? store.trips
    : store.trips.filter(t => t.operatorId === operatorId);
  const enriched = trips.map(t => {
    const op = store.operators.find(o => o.id === t.operatorId);
    return { ...t, operatorName: op?.name };
  });
  res.json(enriched);
});

// Operator: create trip
router.post('/', auth, requireOperator, (req, res) => {
  const { operatorId, role } = req.user;
  const { from, to, departureTime, price, vehicle, totalSeats, vehicleType, amenities } = req.body;

  const tripId = `trip-${uuidv4().slice(0,8)}`;
  const isRaylane = role === 'admin';

  const trip = {
    id: tripId, operatorId: role === 'admin' ? 'raylane' : operatorId,
    from, to, departureTime, price: Number(price), vehicle,
    totalSeats: Number(totalSeats) || 49, bookedSeats: 0,
    status: isRaylane ? 'LIVE' : 'PENDING',
    vehicleType: vehicleType || 'COACH', amenities: amenities || [],
    createdAt: new Date()
  };
  store.trips.push(trip);

  // Init seats
  store.seats[tripId] = {};
  for (let s = 1; s <= trip.totalSeats; s++) {
    store.seats[tripId][s] = { status: 'AVAILABLE', lockedBy: null, lockedUntil: null };
  }

  if (!isRaylane) {
    store.alerts.push({ id: uuidv4(), type: 'APPROVAL', message: `New trip pending: ${from} → ${to} from operator ${operatorId}`, read: false, createdAt: new Date() });
  }

  res.status(201).json(trip);
});

// Admin: approve/reject trip
router.patch('/:id/status', auth, requireAdmin, (req, res) => {
  const trip = store.trips.find(t => t.id === req.params.id);
  if (!trip) return res.status(404).json({ error: 'Trip not found' });
  trip.status = req.body.status;
  res.json(trip);
});

// Operator/Admin: cancel trip
router.delete('/:id', auth, requireOperator, (req, res) => {
  const trip = store.trips.find(t => t.id === req.params.id);
  if (!trip) return res.status(404).json({ error: 'Trip not found' });
  if (req.user.role !== 'admin' && trip.operatorId !== req.user.operatorId)
    return res.status(403).json({ error: 'Not your trip' });
  trip.status = 'CANCELLED';
  res.json({ message: 'Trip cancelled' });
});

module.exports = router;
