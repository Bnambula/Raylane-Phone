const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const store = require('../store');
const { auth } = require('../middleware/auth');

// Get seat map for trip
router.get('/:tripId', (req, res) => {
  const { tripId } = req.params;
  const seats = store.seats[tripId];
  if (!seats) return res.status(404).json({ error: 'Trip seats not found' });
  
  // Clean expired locks
  const now = Date.now();
  Object.entries(seats).forEach(([num, seat]) => {
    if (seat.status === 'LOCKED' && seat.lockedUntil && now > new Date(seat.lockedUntil).getTime()) {
      seats[num] = { status: 'AVAILABLE', lockedBy: null, lockedUntil: null };
    }
  });

  res.json(seats);
});

// Lock a seat (5 minute timer)
router.post('/:tripId/lock', (req, res) => {
  const { tripId } = req.params;
  const { seatNumber, sessionId } = req.body;
  const seats = store.seats[tripId];

  if (!seats) return res.status(404).json({ error: 'Trip not found' });

  const seat = seats[seatNumber];
  if (!seat) return res.status(404).json({ error: 'Seat not found' });

  const now = Date.now();
  // Clean expired lock
  if (seat.status === 'LOCKED' && seat.lockedUntil && now > new Date(seat.lockedUntil).getTime()) {
    seat.status = 'AVAILABLE';
  }

  if (seat.status !== 'AVAILABLE') {
    return res.status(409).json({ error: `Seat ${seatNumber} is ${seat.status}` });
  }

  const lockedUntil = new Date(now + 5 * 60 * 1000);
  seats[seatNumber] = { status: 'LOCKED', lockedBy: sessionId, lockedUntil };
  res.json({ seatNumber, lockedUntil, message: 'Seat locked for 5 minutes' });
});

// Release a seat lock
router.post('/:tripId/release', (req, res) => {
  const { tripId } = req.params;
  const { seatNumber, sessionId } = req.body;
  const seats = store.seats[tripId];
  const seat = seats?.[seatNumber];

  if (seat && seat.lockedBy === sessionId) {
    seats[seatNumber] = { status: 'AVAILABLE', lockedBy: null, lockedUntil: null };
  }
  res.json({ message: 'Released' });
});

// Operator: manually mark seat
router.patch('/:tripId/:seatNumber', auth, (req, res) => {
  const { tripId, seatNumber } = req.params;
  const { status } = req.body;
  if (!store.seats[tripId]) return res.status(404).json({ error: 'Trip not found' });
  store.seats[tripId][seatNumber] = { status, lockedBy: null, lockedUntil: null };
  res.json({ seatNumber, status });
});

module.exports = router;
