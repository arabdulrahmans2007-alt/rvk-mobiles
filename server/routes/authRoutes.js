const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/authController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

router.post('/register', authCtrl.register);
router.post('/login', authCtrl.login);
router.get('/profile', requireAuth, authCtrl.getProfile);
router.put('/profile', requireAuth, authCtrl.updateProfile);

// Admin auth
router.post('/admin-login', authCtrl.adminLogin);
router.get('/admin-me', requireAdmin, authCtrl.getCurrentAdmin);

module.exports = router;