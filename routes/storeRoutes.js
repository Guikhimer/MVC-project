const express = require('express');
const { requirePageAuth } = require('../middleware/auth');
const { renderNewProduct, createProductFromForm } = require('../controllers/productController');

const router = express.Router();

router.get('/novo', requirePageAuth, renderNewProduct);
router.post('/', requirePageAuth, createProductFromForm);

module.exports = router;
