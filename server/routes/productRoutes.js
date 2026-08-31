const express = require('express');
const router = express.Router();
const productCtrl = require('../controllers/productController');
const { requireAdmin } = require('../middleware/auth');

router.get('/', productCtrl.getProducts);
router.get('/categories', productCtrl.getCategories);
router.get('/:id', productCtrl.getProduct);

// Admin Product routes
router.post('/', requireAdmin, productCtrl.createProduct);
router.put('/:id', requireAdmin, productCtrl.updateProduct);
router.delete('/:id', requireAdmin, productCtrl.deleteProduct);

module.exports = router;