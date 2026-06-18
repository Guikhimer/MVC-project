const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  renderProducts
} = require('../controllers/productController');

router.get('/view', renderProducts);

// GET    /api/products        -> Lista todos os produtos
// POST   /api/products        -> Cria um novo produto
router.route('/').get(getProducts).post(createProduct);

// GET    /api/products/:id    -> Retorna um produto pelo ID
// PUT    /api/products/:id    -> Atualiza um produto pelo ID
// DELETE /api/products/:id    -> Remove (soft delete) um produto pelo ID
router.route('/:id').get(getProductById).put(updateProduct).delete(deleteProduct);

module.exports = router;
