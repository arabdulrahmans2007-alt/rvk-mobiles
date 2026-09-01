const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const { getDb } = require('../server/config/db');
const seed = require('../server/seed');

const authRoutes = require('../server/routes/authRoutes');
const productRoutes = require('../server/routes/productRoutes');
const orderRoutes = require('../server/routes/orderRoutes');
const serviceRoutes = require('../server/routes/serviceRoutes');
const offerRoutes = require('../server/routes/offerRoutes');
const notificationRoutes = require('../server/routes/notificationRoutes');
const adminRoutes = require('../server/routes/adminRoutes');

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Ensure DB is initialized
let dbInitialized = false;
async function ensureDb() {
  if (!dbInitialized) {
    await getDb();
    await seed();
    dbInitialized = true;
  }
}

app.use(async (req, res, next) => {
  try {
    await ensureDb();
    next();
  } catch (err) {
    console.error('DB Init Error in Serverless Function:', err);
    next(err);
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'RVK MOBILES API (Vercel Serverless)',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

module.exports = app;