const express = require('express');
const router = express.Router();
const orderCtrl = require('../controllers/orderController');
const { requireAuth, optionalAuth, requireAdmin } = require('../middleware/auth');

router.post('/', optionalAuth, orderCtrl.createOrder);
router.get('/my-orders', requireAuth, orderCtrl.getCustomerOrders);
router.get('/track', orderCtrl.trackOrder);
router.get('/invoice/:id', orderCtrl.getOrderInvoice);

// Admin order routes
router.get('/admin/all', requireAdmin, orderCtrl.adminGetOrders);
router.put('/admin/:id/status', requireAdmin, orderCtrl.adminUpdateOrderStatus);

module.exports = router;