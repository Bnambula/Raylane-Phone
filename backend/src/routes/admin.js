const router = require('express').Router();
const store = require('../store');
const { auth, requireAdmin } = require('../middleware/auth');

router.get('/dashboard', auth, requireAdmin, (req, res) => {
  const totalOperators = store.operators.length;
  const activeOperators = store.operators.filter(o => o.status === 'ACTIVE').length;
  const pendingOperators = store.operators.filter(o => o.status === 'PENDING').length;
  const liveTrips = store.trips.filter(t => t.status === 'LIVE').length;
  const pendingTrips = store.trips.filter(t => t.status === 'PENDING').length;
  const totalBookings = store.bookings.length;
  const confirmedBookings = store.bookings.filter(b => b.status === 'CONFIRMED').length;
  const totalRevenue = store.payments.reduce((s, p) => s + p.amount, 0);
  const totalCommission = store.payments.reduce((s, p) => s + p.commission, 0);
  const heldBalance = store.payments.filter(p => p.status === 'HELD').reduce((s, p) => s + p.operatorNet, 0);
  const unreadAlerts = store.alerts.filter(a => !a.read).length;

  res.json({ totalOperators, activeOperators, pendingOperators, liveTrips, pendingTrips, totalBookings, confirmedBookings, totalRevenue, totalCommission, heldBalance, unreadAlerts });
});

router.get('/alerts', auth, requireAdmin, (req, res) => {
  res.json(store.alerts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
});

router.patch('/alerts/:id/read', auth, requireAdmin, (req, res) => {
  const alert = store.alerts.find(a => a.id === req.params.id);
  if (alert) alert.read = true;
  res.json({ message: 'Marked as read' });
});

router.get('/payouts', auth, requireAdmin, (req, res) => res.json(store.payouts));

module.exports = router;
