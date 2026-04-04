const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const store = require('../store');
const { auth, requireAdmin, requireOperator } = require('../middleware/auth');

// Create booking (public — passengers don't need accounts)
router.post('/', (req, res) => {
  const { tripId, passengerName, passengerPhone, seatNumber, sessionId, paymentMethod, isAdvance } = req.body;

  const trip = store.trips.find(t => t.id === tripId);
  if (!trip || trip.status !== 'LIVE') return res.status(400).json({ error: 'Trip not available' });

  const seats = store.seats[tripId];
  const seat = seats?.[seatNumber];
  if (!seat) return res.status(404).json({ error: 'Seat not found' });
  if (seat.status !== 'LOCKED' || seat.lockedBy !== sessionId) return res.status(409).json({ error: 'Seat not locked by your session' });

  const bookingId = `BK-${uuidv4().slice(0,6).toUpperCase()}`;
  const ticketCode = `RL-${uuidv4().slice(0,4).toUpperCase()}-${uuidv4().slice(0,4).toUpperCase()}`;
  const amount = isAdvance ? Math.round(trip.price * 0.2) : trip.price;

  const booking = {
    id: bookingId, tripId, passengerName, passengerPhone, seatNumber,
    status: 'PENDING_PAYMENT', amount, fullAmount: trip.price,
    isAdvance: !!isAdvance, balanceDue: isAdvance ? trip.price - amount : 0,
    paymentMethod, ticketCode, sessionId, createdAt: new Date()
  };
  store.bookings.push(booking);

  // Simulate payment verification (in prod: real API call)
  setTimeout(() => {
    const bk = store.bookings.find(b => b.id === bookingId);
    if (!bk) return;
    bk.status = 'CONFIRMED';

    // Confirm seat
    seats[seatNumber] = { status: 'BOOKED', lockedBy: null, lockedUntil: null };
    trip.bookedSeats = (trip.bookedSeats || 0) + 1;

    // Create payment record
    const commission = Math.round(amount * 0.08);
    const op = store.operators.find(o => o.id === trip.operatorId);
    store.payments.push({
      id: `pay-${uuidv4().slice(0,8)}`, bookingId,
      operatorId: trip.operatorId, tripId,
      amount, commission, operatorNet: amount - commission,
      status: 'HELD', method: paymentMethod, createdAt: new Date()
    });
    if (op) op.balance += (amount - commission);

    // Notify
    store.alerts.push({ id: uuidv4(), type: 'BOOKING', message: `New booking ${bookingId} for trip ${tripId}`, read: false, createdAt: new Date() });
  }, 1500);

  res.status(201).json({ bookingId, ticketCode, amount, status: 'PENDING_PAYMENT', message: 'Payment being processed' });
});

// Get booking status (by ticketCode or bookingId)
router.get('/track/:code', (req, res) => {
  const bk = store.bookings.find(b => b.ticketCode === req.params.code || b.id === req.params.code);
  if (!bk) return res.status(404).json({ error: 'Booking not found' });
  const trip = store.trips.find(t => t.id === bk.tripId);
  const op = trip ? store.operators.find(o => o.id === trip.operatorId) : null;
  res.json({ ...bk, trip, operatorName: op?.name });
});

// Operator: get bookings for their trips
router.get('/', auth, requireOperator, (req, res) => {
  const { operatorId, role } = req.user;
  const myTripIds = role === 'admin'
    ? store.trips.map(t => t.id)
    : store.trips.filter(t => t.operatorId === operatorId).map(t => t.id);

  const bookings = store.bookings.filter(b => myTripIds.includes(b.tripId));
  res.json(bookings);
});

// Admin: all bookings
router.get('/all', auth, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  res.json(store.bookings);
});

// Operator: confirm boarding
router.patch('/:id/board', auth, requireOperator, (req, res) => {
  const bk = store.bookings.find(b => b.id === req.params.id);
  if (!bk) return res.status(404).json({ error: 'Not found' });
  bk.boarded = true;
  res.json(bk);
});

module.exports = router;
