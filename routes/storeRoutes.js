const express = require('express');
const { requirePageAuth } = require('../middleware/auth');
const {
  renderNewProduct,
  createProductFromForm,
  renderEditProduct,
  updateProductFromForm,
  deleteProductFromForm,
} = require('../controllers/productController');

const router = express.Router();

router.get('/novo', requirePageAuth, renderNewProduct);
router.post('/', requirePageAuth, createProductFromForm);
router.get('/:id/editar', requirePageAuth, renderEditProduct);
router.post('/:id', requirePageAuth, updateProductFromForm);
router.post('/:id/excluir', requirePageAuth, deleteProductFromForm);

module.exports = router;
