const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://frontend-khaki-one-a0cry056by.vercel.app',
  'http://localhost:5173'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Webhook route MUST come before express.json() so raw body is preserved for Stripe signature verification
app.use('/api/webhooks', require('./src/routes/webhook'));

app.use(express.json());

// Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/services', require('./src/routes/services'));
app.use('/api/bookings', require('./src/routes/bookings'));
app.use('/api/admin', require('./src/routes/admin'));

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Booking API running', status: 'OK' });
});

const PORT = process.env.PORT || 5000;

// Export mapping for Vercel serverless functions
module.exports = app;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`✓ Server running on http://localhost:${PORT}`);
  });
}