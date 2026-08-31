const express = require('express');
const router = express.Router();
const serviceCtrl = require('../controllers/serviceController');
const { optionalAuth, requireAdmin } = require('../middleware/auth');

router.get('/display-pricing', serviceCtrl.getDisplayPricingInfo);
router.post('/display-booking', optionalAuth, serviceCtrl.bookDisplayService);
router.post('/doorstep-booking', optionalAuth, serviceCtrl.bookDoorstepService);
router.get('/track', serviceCtrl.trackServiceBooking);

// Admin service routes
router.get('/admin/display', requireAdmin, serviceCtrl.adminGetDisplayServices);
router.put('/admin/display/:id', requireAdmin, serviceCtrl.adminUpdateDisplayService);
router.get('/admin/doorstep', requireAdmin, serviceCtrl.adminGetDoorstepBookings);
router.put('/admin/doorstep/:id', requireAdmin, serviceCtrl.adminUpdateDoorstepBooking);

module.exports = router;