const express = require('express');
const router = express.Router();
const notifCtrl = require('../controllers/notificationController');
const { optionalAuth, requireAuth, requireAdmin } = require('../middleware/auth');

router.get('/', optionalAuth, notifCtrl.getNotifications);
router.put('/:id/read', notifCtrl.markAsRead);
router.put('/read-all', optionalAuth, notifCtrl.markAllAsRead);

// Admin notification routes
router.post('/admin/send', requireAdmin, notifCtrl.adminCreateNotification);
router.get('/admin/logs', requireAdmin, notifCtrl.adminGetLogs);

module.exports = router;