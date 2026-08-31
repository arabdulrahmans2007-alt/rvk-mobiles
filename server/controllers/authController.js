const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../config/db');
const { JWT_SECRET } = require('../middleware/auth');

// Customer Register
exports.register = async (req, res) => {
  try {
    const { name, email, phone, password, address } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, phone, and password.' });
    }

    const existing = await db.get("SELECT id FROM users WHERE email = ?", [email.toLowerCase().trim()]);
    if (existing) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const result = await db.run(
      "INSERT INTO users (name, email, phone, password_hash, address, is_member) VALUES (?, ?, ?, ?, ?, 0)",
      [name.trim(), email.toLowerCase().trim(), phone.trim(), passwordHash, address ? address.trim() : '']
    );

    const userId = result.lastInsertRowid;
    const user = await db.get("SELECT id, name, email, phone, address, is_member, created_at FROM users WHERE id = ?", [userId]);

    const token = jwt.sign({ id: user.id, email: user.email, role: 'customer' }, JWT_SECRET, { expiresIn: '30d' });

    // Create a personalized welcome notification
    await db.run(
      "INSERT INTO notifications (title, message, type, target_url, user_id, is_broadcast, is_read) VALUES (?, ?, ?, ?, ?, 0, 0)",
      [
        '👋 Welcome to RVK MOBILES!',
        `Welcome ${name}! Check out our verified accessories and doorstep screen repair in Trichy.`,
        'welcome',
        '/products',
        userId
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ success: false, message: 'Server error creating user.' });
  }
};

// Customer Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    const user = await db.get("SELECT * FROM users WHERE email = ?", [email.toLowerCase().trim()]);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = bcrypt.compareSync(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: 'customer' }, JWT_SECRET, { expiresIn: '30d' });

    delete user.password_hash;

    res.json({
      success: true,
      message: 'Logged in successfully',
      token,
      user
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
};

// Get Current Profile
exports.getProfile = async (req, res) => {
  try {
    const user = await db.get("SELECT id, name, email, phone, address, is_member, created_at FROM users WHERE id = ?", [req.user.id]);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch profile' });
  }
};

// Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    await db.run(
      "UPDATE users SET name = ?, phone = ?, address = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [name, phone, address, req.user.id]
    );

    const user = await db.get("SELECT id, name, email, phone, address, is_member, created_at FROM users WHERE id = ?", [req.user.id]);
    res.json({ success: true, message: 'Profile updated successfully', user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
};

// Admin Login
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email/username and password.' });
    }

    const admin = await db.get("SELECT * FROM admins WHERE email = ? OR username = ?", [email.toLowerCase().trim(), email.trim()]);
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials.' });
    }

    const isMatch = bcrypt.compareSync(password, admin.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials.' });
    }

    const token = jwt.sign({ id: admin.id, email: admin.email, role: admin.role, isAdmin: true }, JWT_SECRET, { expiresIn: '7d' });

    delete admin.password_hash;

    res.json({
      success: true,
      message: 'Admin access authorized',
      token,
      admin
    });
  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ success: false, message: 'Server error during admin authentication.' });
  }
};

// Get Current Admin
exports.getCurrentAdmin = async (req, res) => {
  try {
    const admin = await db.get("SELECT id, username, email, full_name, role, created_at FROM admins WHERE id = ?", [req.admin.id]);
    res.json({ success: true, admin });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch admin profile' });
  }
};