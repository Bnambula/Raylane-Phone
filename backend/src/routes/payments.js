const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const store = require('../store');
const { auth, requireAdmin, requireOperator } = require('../middleware/auth');

// Admin: view all payments
router.get('/', auth, requireAdmin, (req, res) => {
  const enriched = store.payments.map(p => {
    const bk = store.bookings.find(b => b.id === p.bookingId);
    const trip = store.trips.find(t => t.id === p.tripId);
    const op = store.operators.find(o => o.id === p.operatorId);
    return { ...p, passengerName: bk?.passengerName, route: trip ? `${trip.from} → ${trip.to}` : '', operatorName: op?.name };
  });
  res.json(enriched);
});

// Operator: view own payments
router.get('/my', auth, requireOperator, (req, res) => {
  const payments = store.payments.filter(p => p.operatorId === req.user.operatorId);
  res.json(payments);
});

// Admin: trigger payout for a trip
router.post('/payout/:tripId', auth, requireAdmin, (req, res) => {
  const tripPayments = store.payments.filter(p => p.tripId === req.params.tripId && p.status === 'HELD');
  if (!tripPayments.length) return res.status(400).json({ error: 'No held payments for this trip' });

  // Check no duplicate payout
  const alreadyPaid = store.payouts.find(po => po.tripId === req.params.tripId);
  if (alreadyPaid) return res.status(400).json({ error: 'Payout already released for this trip' });

  const trip = store.trips.find(t => t.id === req.params.tripId);
  const op = store.operators.find(o => o.id === trip?.operatorId);
  if (!op?.merchantCode) return res.status(400).json({ error: 'Operator has no merchant code registered' });

  const totalNet = tripPayments.reduce((s, p) => s + p.operatorNet, 0);
  const totalCommission = tripPayments.reduce((s, p) => s + p.commission, 0);

  tripPayments.forEach(p => { p.status = 'PAID_OUT'; });

  const payout = {
    id: `payout-${uuidv4().slice(0,8)}`, tripId: req.params.tripId,
    operatorId: trip.operatorId, merchantCode: op.merchantCode,
    amount: totalNet, commission: totalCommission,
    paidAt: new Date(), createdAt: new Date()
  };
  store.payouts.push(payout);

  store.alerts.push({ id: uuidv4(), type: 'FINANCIAL', message: `Payout of UGX ${totalNet.toLocaleString()} released to ${op.name}`, read: false, createdAt: new Date() });

  res.json({ message: 'Payout released', payout });
});

// Financial summary
router.get('/summary', auth, requireAdmin, (req, res) => {
  const totalRevenue = store.payments.reduce((s, p) => s + p.amount, 0);
  const totalCommission = store.payments.reduce((s, p) => s + p.commission, 0);
  const held = store.payments.filter(p => p.status === 'HELD').reduce((s, p) => s + p.operatorNet, 0);
  const paidOut = store.payments.filter(p => p.status === 'PAID_OUT').reduce((s, p) => s + p.operatorNet, 0);
  res.json({ totalRevenue, totalCommission, held, paidOut, totalTransactions: store.payments.length });
});

module.exports = router;
