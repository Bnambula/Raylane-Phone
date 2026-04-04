require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./routes/auth');
const tripRoutes = require('./routes/trips');
const bookingRoutes = require('./routes/bookings');
const operatorRoutes = require('./routes/operators');
const paymentRoutes = require('./routes/payments');
const parcelRoutes = require('./routes/parcels');
const adminRoutes = require('./routes/admin');
const seatRoutes = require('./routes/seats');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/operators', operatorRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/parcels', parcelRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/seats', seatRoutes);

// Health check
app.get('/health', (req, res) => res.json({ status: 'OK', service: 'Raylane Express API' }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => console.log(`🚌 Raylane API running on port ${PORT}`));
module.exports = app;
