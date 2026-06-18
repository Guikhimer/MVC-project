const mongoose = require('mongoose');

/**
 * @typedef {Object} ProductData
 * @property {string} name - Nome do produto.
 * @property {string} description - Descrição detalhada do produto.
 * @property {number} price - Preço do produto (deve ser >= 0).
 * @property {number} stock - Quantidade disponível em estoque (deve ser >= 0).
 * @property {boolean} active - Indica se o produto está ativo/visível.
 * @property {Date} createdAt - Data de criação (gerada automaticamente).
 * @property {Date} updatedAt - Data de atualização (gerada automaticamente).
 */

/**
 * Schema Mongoose que define a estrutura de um Produto no banco de dados.
 * @type {mongoose.Schema<ProductData>}
 */
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'O nome do produto é obrigatório.'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'A descrição do produto é obrigatória.'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'O preço do produto é obrigatório.'],
      min: [0, 'O preço não pode ser negativo.'],
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, 'O estoque não pode ser negativo.'],
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * @class Product
 * @classdesc Model Mongoose representando um Produto na coleção "products" do MongoDB.
 *            Fornece métodos estáticos herdados do Mongoose para operações CRUD.
 *
 * @example
 * // Criar um novo produto
 * const product = new Product({ name: 'Camiseta', price: 49.90, description: '...', stock: 100 });
 * await product.save();
 *
 * @example
 * // Buscar todos os produtos
 * const products = await Product.findAll();
 */
const Product = mongoose.model('Product', productSchema);

/**
 * Retorna todos os produtos ativos cadastrados no banco de dados.
 * @async
 * @function findAll
 * @memberof Product
 * @returns {Promise<ProductData[]>} Lista de produtos ativos, ordenados do mais recente ao mais antigo.
 * @throws {Error} Lança um erro se a consulta ao banco de dados falhar.
 * @example
 * const products = await Product.findAll();
 * console.log(products); // [{ name: 'Camiseta', price: 49.90, ... }, ...]
 */
productSchema.statics.findAll = async function () {
  return this.find({ active: true }).sort({ createdAt: -1 });
};

/**
 * Busca um produto pelo seu ID único do MongoDB.
 * @async
 * @function findById
 * @memberof Product
 * @param {string} id - O ID (ObjectId) do produto a ser buscado.
 * @returns {Promise<ProductData|null>} O documento do produto encontrado, ou null se não existir.
 * @throws {Error} Lança um erro se o ID for inválido ou se a consulta falhar.
 * @example
 * const product = await Product.findById('64abc123def456ghi789jkl0');
 */
productSchema.statics.findById = async function (id) {
  return this.findOne({ _id: id, active: true });
};

/**
 * Cria e persiste um novo produto no banco de dados.
 * @async
 * @function createProduct
 * @memberof Product
 * @param {Omit<ProductData, 'createdAt'|'updatedAt'>} data - Dados do produto a ser criado.
 * @returns {Promise<ProductData>} O documento do produto recém-criado.
 * @throws {mongoose.Error.ValidationError} Lança erro de validação se campos obrigatórios estiverem ausentes ou inválidos.
 * @example
 * const newProduct = await Product.createProduct({
 *   name: 'Tênis Runner',
 *   description: 'Tênis para corrida',
 *   price: 299.90,
 *   stock: 50
 * });
 */
productSchema.statics.createProduct = async function (data) {
  const product = new this(data);
  return product.save();
};

/**
 * Atualiza os dados de um produto existente pelo seu ID.
 * @async
 * @function updateProduct
 * @memberof Product
 * @param {string} id - O ID (ObjectId) do produto a ser atualizado.
 * @param {Partial<ProductData>} data - Objeto contendo apenas os campos a serem modificados.
 * @returns {Promise<ProductData|null>} O documento do produto atualizado, ou null se não encontrado.
 * @throws {Error} Lança um erro se o ID for inválido ou se a atualização falhar.
 * @example
 * const updated = await Product.updateProduct('64abc123...', { price: 199.90, stock: 30 });
 */
productSchema.statics.updateProduct = async function (id, data) {
  return this.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

/**
 * Realiza a exclusão lógica (soft delete) de um produto, marcando-o como inativo.
 * O produto não é removido do banco, apenas ocultado das listagens ativas.
 * @async
 * @function softDelete
 * @memberof Product
 * @param {string} id - O ID (ObjectId) do produto a ser desativado.
 * @returns {Promise<ProductData|null>} O documento do produto atualizado com active=false, ou null.
 * @throws {Error} Lança um erro se o ID for inválido ou se a operação falhar.
 * @example
 * await Product.softDelete('64abc123def456ghi789jkl0');
 */
productSchema.statics.softDelete = async function (id) {
  return this.findByIdAndUpdate(id, { active: false }, { new: true });
};

module.exports = Product;
