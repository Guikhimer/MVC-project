const Product = require('../models/Product');

/**
 * Renderiza a página de listagem de produtos.
 * Busca todos os produtos cadastrados no banco de dados e envia os dados
 * para a View "products.ejs", responsável por exibir a lista em HTML.
 *
 * @async
 * @function renderProducts
 * @param {import('express').Request} req - Objeto de requisição HTTP do Express.
 * @param {import('express').Response} res - Objeto de resposta HTTP do Express.
 * @returns {Promise<void>} Renderiza a View "products" com os produtos encontrados
 * ou retorna status 500 em caso de erro.
 *
 * @example
 * // GET /products/view
 * // Renderiza a página:
 * // views/products.ejs
 */
const renderProducts = async (req, res) => {
  try {
    const products = await Product.findAll();

    res.render('products', {
      products
    });

  } catch (error) {
    res.status(500).send(error.message);
  }
};

const renderProductForm = (res, { error = null, product = {}, editing = false } = {}) => {
  res.render('product-form', {
    page: editing ? 'edit-product' : 'new-product',
    error,
    editing,
    action: editing ? `/produtos/${product._id}` : '/produtos',
    product: {
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      stock: product.stock ?? 0,
    },
  });
};

const renderNewProduct = (req, res) => renderProductForm(res);

const createProductFromForm = async (req, res) => {
  const { name, description, price, stock } = req.body;
  const parsedPrice = Number(price);
  const parsedStock = stock === '' || stock === undefined ? 0 : Number(stock);

  if (!name?.trim() || !description?.trim() || !Number.isFinite(parsedPrice) || parsedPrice < 0 || !Number.isInteger(parsedStock) || parsedStock < 0) {
    return renderProductForm(res.status(400), {
      error: 'Informe nome, descrição, preço válido e estoque igual ou maior que zero.',
      product: { name, description, price, stock },
    });
  }

  try {
    await Product.createProduct({
      name: name.trim(),
      description: description.trim(),
      price: parsedPrice,
      stock: parsedStock,
    });
    return res.redirect('/api/products/view');
  } catch {
    return renderProductForm(res.status(500), {
      error: 'Não foi possível cadastrar o produto. Tente novamente.',
      product: { name, description, price, stock },
    });
  }
};

const renderEditProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.redirect('/api/products/view');
    return renderProductForm(res, { product, editing: true });
  } catch {
    return res.redirect('/api/products/view');
  }
};

const updateProductFromForm = async (req, res) => {
  const { name, description, price, stock } = req.body;
  const parsedPrice = Number(price);
  const parsedStock = stock === '' || stock === undefined ? 0 : Number(stock);
  const product = { _id: req.params.id, name, description, price, stock };

  if (!name?.trim() || !description?.trim() || !Number.isFinite(parsedPrice) || parsedPrice < 0 || !Number.isInteger(parsedStock) || parsedStock < 0) {
    return renderProductForm(res.status(400), {
      error: 'Informe nome, descrição, preço válido e estoque igual ou maior que zero.',
      product,
      editing: true,
    });
  }

  try {
    const updatedProduct = await Product.updateProduct(req.params.id, {
      name: name.trim(),
      description: description.trim(),
      price: parsedPrice,
      stock: parsedStock,
    });
    if (!updatedProduct) return res.redirect('/api/products/view');
    return res.redirect('/api/products/view');
  } catch {
    return renderProductForm(res.status(500), {
      error: 'Não foi possível atualizar o produto. Tente novamente.',
      product,
      editing: true,
    });
  }
};

const deleteProductFromForm = async (req, res) => {
  try {
    await Product.softDelete(req.params.id);
  } catch {
    // A listagem permanece disponível mesmo se o item já tiver sido removido.
  }
  return res.redirect('/api/products/view');
};

/**
 * @module productController
 * @description Controller responsável por interceptar requisições HTTP relacionadas
 *              a Produtos e delegar as operações à camada Model. Segue o padrão MVC.
 */

/**
 * Retorna a lista de todos os produtos ativos.
 * @async
 * @function getProducts
 * @param {import('express').Request} req - Objeto de requisição do Express (sem parâmetros necessários).
 * @param {import('express').Response} res - Objeto de resposta do Express.
 * @returns {Promise<void>} Responde com status 200 e um array JSON de produtos,
 *                          ou status 500 em caso de erro interno.
 * @example
 * // GET /api/products
 * // Resposta: { success: true, count: 2, data: [ {...}, {...} ] }
 */
const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    return res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erro ao buscar produtos.',
      error: error.message,
    });
  }
};

/**
 * Retorna um único produto com base no ID fornecido na URL.
 * @async
 * @function getProductById
 * @param {import('express').Request} req - Objeto de requisição do Express.
 * @param {Object} req.params - Parâmetros extraídos da URL.
 * @param {string} req.params.id - O ID (ObjectId) do produto a ser buscado.
 * @param {import('express').Response} res - Objeto de resposta do Express.
 * @returns {Promise<void>} Responde com status 200 e o produto encontrado,
 *                          404 se não encontrado, ou 500 em caso de erro.
 * @example
 * // GET /api/products/64abc123def456ghi789jkl0
 * // Resposta: { success: true, data: { name: 'Camiseta', price: 49.90, ... } }
 */
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado.',
      });
    }

    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erro ao buscar produto.',
      error: error.message,
    });
  }
};

/**
 * Cria um novo produto com os dados enviados no corpo da requisição.
 * @async
 * @function createProduct
 * @param {import('express').Request} req - Objeto de requisição do Express.
 * @param {Object} req.body - Corpo da requisição com os dados do produto.
 * @param {string} req.body.name - Nome do produto (obrigatório).
 * @param {string} req.body.description - Descrição do produto (obrigatório).
 * @param {number} req.body.price - Preço do produto em reais (obrigatório, >= 0).
 * @param {number} [req.body.stock=0] - Quantidade em estoque (opcional).
 * @param {import('express').Response} res - Objeto de resposta do Express.
 * @returns {Promise<void>} Responde com status 201 e o produto criado,
 *                          400 para dados inválidos, ou 500 em caso de erro.
 * @example
 * // POST /api/products
 * // Body: { "name": "Tênis Runner", "description": "...", "price": 299.90, "stock": 50 }
 * // Resposta: { success: true, data: { _id: '...', name: 'Tênis Runner', ... } }
 */
const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;

    if (!name || !description || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Campos obrigatórios: name, description e price.',
      });
    }

    const product = await Product.createProduct({ name, description, price, stock });

    return res.status(201).json({ success: true, data: product });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos.',
        error: error.message,
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Erro ao criar produto.',
      error: error.message,
    });
  }
};

/**
 * Atualiza parcialmente um produto existente com base no ID da URL.
 * @async
 * @function updateProduct
 * @param {import('express').Request} req - Objeto de requisição do Express.
 * @param {Object} req.params - Parâmetros extraídos da URL.
 * @param {string} req.params.id - O ID (ObjectId) do produto a ser atualizado.
 * @param {Partial<{name: string, description: string, price: number, stock: number}>} req.body
 *        Campos do produto que serão atualizados (ao menos um deve ser informado).
 * @param {import('express').Response} res - Objeto de resposta do Express.
 * @returns {Promise<void>} Responde com status 200 e o produto atualizado,
 *                          404 se não encontrado, ou 500 em caso de erro.
 * @example
 * // PUT /api/products/64abc123def456ghi789jkl0
 * // Body: { "price": 199.90 }
 * // Resposta: { success: true, data: { ..., price: 199.90 } }
 */
const updateProduct = async (req, res) => {
  try {
    const product = await Product.updateProduct(req.params.id, req.body);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado.',
      });
    }

    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erro ao atualizar produto.',
      error: error.message,
    });
  }
};

/**
 * Realiza a exclusão lógica (soft delete) de um produto pelo ID da URL.
 * O produto não é removido do banco; apenas é marcado como inativo (active: false).
 * @async
 * @function deleteProduct
 * @param {import('express').Request} req - Objeto de requisição do Express.
 * @param {Object} req.params - Parâmetros extraídos da URL.
 * @param {string} req.params.id - O ID (ObjectId) do produto a ser desativado.
 * @param {import('express').Response} res - Objeto de resposta do Express.
 * @returns {Promise<void>} Responde com status 200 confirmando a exclusão,
 *                          404 se não encontrado, ou 500 em caso de erro.
 * @example
 * // DELETE /api/products/64abc123def456ghi789jkl0
 * // Resposta: { success: true, message: 'Produto removido com sucesso.' }
 */
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.softDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Produto removido com sucesso.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Erro ao remover produto.',
      error: error.message,
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  renderProducts,
  renderNewProduct,
  createProductFromForm,
  renderEditProduct,
  updateProductFromForm,
  deleteProductFromForm,
};
