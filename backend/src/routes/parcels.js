const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const store = require('../store');
const { auth, requireOperator } = require('../middleware/auth');

router.post('/', (req, res) => {
  const { senderName, senderPhone, recipientName, recipientPhone, destination, description, weight, insure } = req.body;
  const baseFee = Math.max(5000, weight * 2000);
  const insuranceFee = insure ? Math.round(baseFee * 0.03) : 0;
  const parcel = {
    id: `PCL-${uuidv4().slice(0,6).toUpperCase()}`,
    senderName, senderPhone, recipientName, recipientPhone,
    destination, description, weight: Number(weight),
    status: 'BOOKED', insure: !!insure,
    fee: baseFee + insuranceFee, insuranceFee,
    trackingCode: `RY${Math.random().toString(36).slice(2,8).toUpperCase()}`,
    createdAt: new Date()
  };
  store.parcels.push(parcel);
  res.status(201).json(parcel);
});

router.get('/track/:code', (req, res) => {
  const p = store.parcels.find(p => p.trackingCode === req.params.code || p.id === req.params.code);
  if (!p) return res.status(404).json({ error: 'Parcel not found' });
  res.json(p);
});

router.get('/', auth, requireOperator, (req, res) => res.json(store.parcels));

router.patch('/:id/status', auth, requireOperator, (req, res) => {
  const p = store.parcels.find(p => p.id === req.params.id);
  if (!p) return res.status(404).json({ error: 'Not found' });
  p.status = req.body.status;
  res.json(p);
});

module.exports = router;
