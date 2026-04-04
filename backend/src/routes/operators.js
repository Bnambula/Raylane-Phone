// operators.js
const router = require('express').Router();
const store = require('../store');
const { auth, requireAdmin, requireOperator } = require('../middleware/auth');

router.get('/', auth, requireAdmin, (req, res) => res.json(store.operators));
router.get('/me', auth, requireOperator, (req, res) => {
  const op = store.operators.find(o => o.id === req.user.operatorId);
  if (!op) return res.status(404).json({ error: 'Not found' });
  res.json(op);
});

router.patch('/:id/status', auth, requireAdmin, (req, res) => {
  const op = store.operators.find(o => o.id === req.params.id);
  if (!op) return res.status(404).json({ error: 'Not found' });
  op.status = req.body.status;
  res.json(op);
});

router.patch('/:id/modules', auth, requireAdmin, (req, res) => {
  const op = store.operators.find(o => o.id === req.params.id);
  if (!op) return res.status(404).json({ error: 'Not found' });
  op.modules = req.body.modules;
  res.json(op);
});

router.patch('/:id/managed', auth, requireAdmin, (req, res) => {
  const op = store.operators.find(o => o.id === req.params.id);
  if (!op) return res.status(404).json({ error: 'Not found' });
  op.managedByRaylane = req.body.managedByRaylane;
  res.json(op);
});

router.patch('/:id/merchant', auth, requireAdmin, (req, res) => {
  const op = store.operators.find(o => o.id === req.params.id);
  if (!op) return res.status(404).json({ error: 'Not found' });
  op.merchantCode = req.body.merchantCode;
  res.json(op);
});

module.exports = router;
