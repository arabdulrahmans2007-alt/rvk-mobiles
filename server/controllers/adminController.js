const bcrypt = require('bcryptjs');
const { db } = require('../config/db');

// Dashboard Stats & KPI
exports.getDashboardStats = async (req, res) => {
  try {
    const totalOrdersRes = await db.get("SELECT COUNT(*) as count FROM orders");
    const pendingOrdersRes = await db.get("SELECT COUNT(*) as count FROM orders WHERE order_status = 'Pending'");
    const completedOrdersRes = await db.get("SELECT COUNT(*) as count FROM orders WHERE order_status = 'Completed'");
    const revenueRes = await db.get("SELECT SUM(total_amount) as total FROM orders WHERE order_status != 'Cancelled'");

    const totalUsersRes = await db.get("SELECT COUNT(*) as count FROM users");
    const totalMembersRes = await db.get("SELECT COUNT(*) as count FROM users WHERE is_member = 1");

    const todayStr = new Date().toISOString().split('T')[0];
    const todayDisplayRes = await db.get("SELECT COUNT(*) as count FROM display_services WHERE created_at LIKE ?", [`${todayStr}%`]);
    const todayDoorstepRes = await db.get("SELECT COUNT(*) as count FROM doorstep_bookings WHERE created_at LIKE ?", [`${todayStr}%`]);
    const todayBookingsCount = (todayDisplayRes?.count || 0) + (todayDoorstepRes?.count || 0);

    const activeOffersRes = await db.get("SELECT COUNT(*) as count FROM offers WHERE is_active = 1");
    const unreadNotifsRes = await db.get("SELECT COUNT(*) as count FROM notifications WHERE is_read = 0");

    const recentOrders = await db.all("SELECT * FROM orders ORDER BY id DESC LIMIT 5");
    const recentDisplay = await db.all("SELECT * FROM display_services ORDER BY id DESC LIMIT 5");
    const recentDoorstep = await db.all("SELECT * FROM doorstep_bookings ORDER BY id DESC LIMIT 5");

    const todaysOffer = await db.get("SELECT * FROM offers WHERE is_todays_offer = 1 AND is_active = 1 LIMIT 1");

    // Top Selling Products
    const topProducts = await db.all(`
      SELECT p.id, p.name, p.price, SUM(oi.quantity) as total_sold, SUM(oi.subtotal) as total_revenue
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      GROUP BY p.id
      ORDER BY total_sold DESC
      LIMIT 5
    `);

    res.json({
      success: true,
      stats: {
        totalOrders: totalOrdersRes?.count || 0,
        pendingOrders: pendingOrdersRes?.count || 0,
        completedOrders: completedOrdersRes?.count || 0,
        totalRevenue: revenueRes?.total || 0,
        totalCustomers: totalUsersRes?.count || 0,
        totalMembers: totalMembersRes?.count || 0,
        todayBookings: todayBookingsCount,
        activeOffers: activeOffersRes?.count || 0,
        unreadNotifications: unreadNotifsRes?.count || 0
      },
      recentOrders,
      recentDisplay,
      recentDoorstep,
      todaysOffer,
      topProducts
    });
  } catch (err) {
    console.error('getDashboardStats error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats' });
  }
};

// Customers List
exports.getCustomers = async (req, res) => {
  try {
    const { search } = req.query;
    let sql = `
      SELECT u.id, u.name, u.email, u.phone, u.address, u.is_member, u.created_at,
             COUNT(DISTINCT o.id) as order_count,
             COALESCE(SUM(o.total_amount), 0) as total_spent
      FROM users u
      LEFT JOIN orders o ON u.id = o.user_id AND o.order_status != 'Cancelled'
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      sql += " AND (u.name LIKE ? OR u.email LIKE ? OR u.phone LIKE ?)";
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    sql += " GROUP BY u.id ORDER BY u.id DESC";

    const customers = await db.all(sql, params);
    res.json({ success: true, count: customers.length, customers });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch customer list' });
  }
};

// Toggle Customer Membership
exports.toggleCustomerMembership = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await db.get("SELECT is_member, name FROM users WHERE id = ?", [id]);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const newStatus = user.is_member === 1 ? 0 : 1;
    await db.run("UPDATE users SET is_member = ? WHERE id = ?", [newStatus, id]);

    if (newStatus === 1) {
      await db.run(
        `INSERT INTO notifications (title, message, type, target_url, user_id, is_broadcast, is_read)
         VALUES (?, ?, 'membership', '/membership', ?, 0, 0)`,
        [
          '🌟 RVK Membership Activated!',
          `Congratulations ${user.name}! Your RVK Membership is active with ₹0 travel fee for doorstep service across any distance.`,
          id
        ]
      );
    }

    res.json({ success: true, message: `Membership updated to ${newStatus === 1 ? 'Active' : 'Inactive'}`, is_member: newStatus });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update membership status' });
  }
};

// Invoices List
exports.getInvoices = async (req, res) => {
  try {
    const sql = `
      SELECT i.*, o.order_number, o.order_status, o.payment_method
      FROM invoices i
      JOIN orders o ON i.order_id = o.id
      ORDER BY i.id DESC
    `;
    const invoices = await db.all(sql);
    res.json({ success: true, count: invoices.length, invoices });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch invoices' });
  }
};

// Sales Reports & Analytics
exports.getReports = async (req, res) => {
  try {
    const monthlySales = await db.all(`
      SELECT strftime('%Y-%m', created_at) as month,
             COUNT(id) as total_orders,
             SUM(total_amount) as total_revenue
      FROM orders
      WHERE order_status != 'Cancelled'
      GROUP BY month
      ORDER BY month DESC
      LIMIT 12
    `);

    const categoryBreakdown = await db.all(`
      SELECT c.name as category_name, COUNT(oi.id) as units_sold, SUM(oi.subtotal) as total_sales
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      JOIN categories c ON p.category_id = c.id
      GROUP BY c.id
      ORDER BY total_sales DESC
    `);

    const statusCounts = await db.all(`
      SELECT order_status, COUNT(id) as count
      FROM orders
      GROUP BY order_status
    `);

    res.json({
      success: true,
      monthlySales,
      categoryBreakdown,
      statusCounts
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to generate reports' });
  }
};

// Get Settings
exports.getSettings = async (req, res) => {
  try {
    const settings = await db.all("SELECT key, value, description FROM settings");
    const formatted = {};
    settings.forEach(s => { formatted[s.key] = s.value; });
    res.json({ success: true, settings: formatted, raw: settings });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch settings' });
  }
};

// Update Settings
exports.updateSettings = async (req, res) => {
  try {
    const entries = req.body;
    for (const [key, value] of Object.entries(entries)) {
      await db.run(
        "INSERT INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP",
        [key, String(value)]
      );
    }
    res.json({ success: true, message: 'Settings saved successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to save settings' });
  }
};

// Admin Users CRUD
exports.getAdminUsers = async (req, res) => {
  try {
    const admins = await db.all("SELECT id, username, email, full_name, role, created_at FROM admins ORDER BY id ASC");
    res.json({ success: true, admins });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch admin users' });
  }
};

exports.createAdminUser = async (req, res) => {
  try {
    const { username, email, password, full_name, role } = req.body;
    if (!username || !email || !password || !full_name) {
      return res.status(400).json({ success: false, message: 'All admin fields are required.' });
    }

    const existing = await db.get("SELECT id FROM admins WHERE email = ? OR username = ?", [email.toLowerCase().trim(), username.trim()]);
    if (existing) {
      return res.status(400).json({ success: false, message: 'Admin username or email already taken.' });
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const result = await db.run(
      "INSERT INTO admins (username, email, password_hash, full_name, role) VALUES (?, ?, ?, ?, ?)",
      [username.trim(), email.toLowerCase().trim(), passwordHash, full_name.trim(), role || 'admin']
    );

    const admin = await db.get("SELECT id, username, email, full_name, role, created_at FROM admins WHERE id = ?", [result.lastInsertRowid]);
    res.status(201).json({ success: true, message: 'Admin user created successfully', admin });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create admin user' });
  }
};

exports.deleteAdminUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (parseInt(id, 10) === req.admin.id) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own admin account.' });
    }

    await db.run("DELETE FROM admins WHERE id = ?", [id]);
    res.json({ success: true, message: 'Admin removed successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete admin user' });
  }
};