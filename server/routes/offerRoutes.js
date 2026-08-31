const express = require('express');
const router = express.Router();
const offerCtrl = require('../controllers/offerController');
const { requireAdmin } = require('../middleware/auth');

router.get('/', offerCtrl.getOffers);
router.get('/today', offerCtrl.getTodaysOffer);

// Admin offer routes
router.get('/admin/all', requireAdmin, offerCtrl.adminGetAllOffers);
router.post('/admin', requireAdmin, offerCtrl.createOffer);
router.put('/admin/:id', requireAdmin, offerCtrl.updateOffer);
router.delete('/admin/:id', requireAdmin, offerCtrl.deleteOffer);

module.exports = router;