const jwt = require('jsonwebtoken');
const { db } = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'rvk_mobiles_super_secret_jwt_key_2026_trichy_secure_key_12345';

// Authenticate customer
async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authentication required. Please login.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.role === 'admin' || decoded.role === 'superadmin') {
      const admin = await db.get("SELECT id, username, email, full_name, role FROM admins WHERE id = ?", [decoded.id]);
      if (!admin) return res.status(401).json({ success: false, message: 'Invalid session' });
      req.user = { ...admin, isAdmin: true };
      return next();
    }

    const user = await db.get("SELECT id, name, email, phone, address, is_member FROM users WHERE id = ?", [decoded.id]);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found or session expired.' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
}

// Optional Auth (for guest checkout vs logged in)
async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      if (decoded.id) {
        const user = await db.get("SELECT id, name, email, phone, address, is_member FROM users WHERE id = ?", [decoded.id]);
        if (user) req.user = user;
      }
    }
  } catch (err) {
    // Ignore invalid token for optional auth
  }
  next();
}

// Require Admin
async function requireAdmin(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Admin authentication required.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded.isAdmin && decoded.role !== 'admin' && decoded.role !== 'superadmin') {
      return res.status(403).json({ success: false, message: 'Forbidden: Admin access only.' });
    }

    const admin = await db.get("SELECT id, username, email, full_name, role FROM admins WHERE id = ?", [decoded.id]);
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Admin account not found.' });
    }

    req.admin = admin;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired admin token.' });
  }
}

module.exports = {
  requireAuth,
  optionalAuth,
  requireAdmin,
  JWT_SECRET
};