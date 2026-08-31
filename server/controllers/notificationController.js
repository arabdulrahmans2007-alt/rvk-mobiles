const { db } = require('../config/db');

// Customer Get Notifications
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;

    let sql = "";
    let params = [];

    if (userId) {
      sql = `
        SELECT * FROM notifications
        WHERE (user_id = ? OR is_broadcast = 1)
        ORDER BY id DESC LIMIT 30
      `;
      params = [userId];
    } else {
      sql = `
        SELECT * FROM notifications
        WHERE is_broadcast = 1
        ORDER BY id DESC LIMIT 20
      `;
      params = [];
    }

    const notifications = await db.all(sql, params);
    const unreadCount = notifications.filter(n => !n.is_read).length;

    res.json({
      success: true,
      count: notifications.length,
      unreadCount,
      notifications
    });
  } catch (err) {
    console.error('getNotifications error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
  }
};

// Mark Single Notification as Read
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    await db.run("UPDATE notifications SET is_read = 1 WHERE id = ?", [id]);
    res.json({ success: true, message: 'Notification marked as read.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update notification.' });
  }
};

// Mark All Notifications as Read
exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    if (userId) {
      await db.run("UPDATE notifications SET is_read = 1 WHERE user_id = ? OR is_broadcast = 1", [userId]);
    } else {
      await db.run("UPDATE notifications SET is_read = 1 WHERE is_broadcast = 1");
    }
    res.json({ success: true, message: 'All notifications marked as read.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to mark notifications as read.' });
  }
};

// Admin Send Custom Notification
exports.adminCreateNotification = async (req, res) => {
  try {
    const { title, message, type, target_url, offer_id, is_broadcast, user_id } = req.body;

    if (!title || !message) {
      return res.status(400).json({ success: false, message: 'Notification title and message are required.' });
    }

    const result = await db.run(
      `INSERT INTO notifications (title, message, type, target_url, offer_id, is_broadcast, user_id, is_read)
       VALUES (?, ?, ?, ?, ?, ?, ?, 0)`,
      [
        title.trim(),
        message.trim(),
        type || 'general',
        target_url || '/offers',
        offer_id || null,
        is_broadcast !== undefined ? (is_broadcast ? 1 : 0) : 1,
        user_id || null
      ]
    );

    const notif = await db.get("SELECT * FROM notifications WHERE id = ?", [result.lastInsertRowid]);
    res.status(201).json({ success: true, message: 'Notification sent successfully', notification: notif });
  } catch (err) {
    console.error('adminCreateNotification error:', err);
    res.status(500).json({ success: false, message: 'Failed to send notification.' });
  }
};

// Admin Get Notification Logs
exports.adminGetLogs = async (req, res) => {
  try {
    const logs = await db.all("SELECT * FROM notifications ORDER BY id DESC LIMIT 100");
    res.json({ success: true, count: logs.length, notifications: logs });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch notification history.' });
  }
};