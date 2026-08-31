const express = require('express');
const router = express.Router();
const adminCtrl = require('../controllers/adminController');
const { requireAdmin } = require('../middleware/auth');

router.use(requireAdmin);

router.get('/dashboard', adminCtrl.getDashboardStats);
router.get('/customers', adminCtrl.getCustomers);
router.put('/customers/:id/membership', adminCtrl.toggleCustomerMembership);
router.get('/invoices', adminCtrl.getInvoices);
router.get('/reports', adminCtrl.getReports);
router.get('/settings', adminCtrl.getSettings);
router.put('/settings', adminCtrl.updateSettings);
router.get('/users', adminCtrl.getAdminUsers);
router.post('/users', adminCtrl.createAdminUser);
router.delete('/users/:id', adminCtrl.deleteAdminUser);

module.exports = router;