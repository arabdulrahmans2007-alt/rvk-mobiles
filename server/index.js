const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const { getDb } = require('./config/db');
const seed = require('./seed');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const offerRoutes = require('./routes/offerRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logger for development
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (req.path.startsWith('/api')) {
      console.log(`[${req.method}] ${req.path} -> ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'RVK MOBILES API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

// Serve Client Static Build if present
const clientDistPath = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientDistPath));

// Fallback to client SPA index.html for non-API routes
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  const indexPath = path.join(clientDistPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(404).send('RVK MOBILES Frontend is compiling or client build is missing. Use Vite dev server at http://localhost:3000');
    }
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled API Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start Server & DB
async function start() {
  try {
    await getDb();
    console.log('SQLite Database connected and tables verified.');

    // Auto seed if database is empty
    await seed();

    app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`  RVK MOBILES Full-Stack Server Running on Port ${PORT}`);
      console.log(`  API Endpoint:   http://localhost:${PORT}/api`);
      console.log(`  Customer Web:   http://localhost:3000 (Vite) / http://localhost:${PORT}`);
      console.log(`  Admin Portal:   http://localhost:3000/admin`);
      console.log(`====================================================`);
    });
  } catch (err) {
    console.error('Failed to start RVK MOBILES server:', err);
    process.exit(1);
  }
}

start();