const jwt = require('jsonwebtoken');
const store = require('../store');
const JWT_SECRET = process.env.JWT_SECRET || 'raylane-secret-2024';

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
  next();
};

const requireOperator = (req, res, next) => {
  if (!['admin','operator'].includes(req.user?.role)) return res.status(403).json({ error: 'Operator access required' });
  next();
};

module.exports = { auth, requireAdmin, requireOperator };
