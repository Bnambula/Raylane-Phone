const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const store = require('../store');
const JWT_SECRET = process.env.JWT_SECRET || 'raylane-secret-2024';

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = store.users.find(u => u.email === email);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, operatorId: user.operatorId, name: user.name },
      JWT_SECRET, { expiresIn: '24h' }
    );
    res.json({ token, user: { id: user.id, email: user.email, role: user.role, name: user.name, operatorId: user.operatorId } });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Register operator
router.post('/register-operator', async (req, res) => {
  try {
    const { name, email, phone, password, services } = req.body;
    if (store.users.find(u => u.email === email)) return res.status(400).json({ error: 'Email already registered' });

    const opId = `op-${uuidv4().slice(0,8)}`;
    const userId = `u-${uuidv4().slice(0,8)}`;
    const hashed = await bcrypt.hash(password, 10);

    store.operators.push({ id: opId, name, email, phone, status: 'PENDING', managedByRaylane: false, modules: [], merchantCode: '', balance: 0, commission: 8, services, createdAt: new Date() });
    store.users.push({ id: userId, email, password: hashed, role: 'operator', operatorId: opId, name, createdAt: new Date() });

    store.alerts.push({ id: uuidv4(), type: 'OPERATOR', message: `New operator application: ${name}`, read: false, createdAt: new Date() });

    res.status(201).json({ message: 'Application submitted. Await admin approval.' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Me
router.get('/me', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'raylane-secret-2024');
    res.json(decoded);
  } catch { res.status(401).json({ error: 'Invalid token' }); }
});

module.exports = router;
