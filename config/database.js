const mongoose = require('mongoose');

/**
 * Estabelece a conexão com o banco de dados MongoDB.
 * Utiliza a variável de ambiente MONGO_URI para a string de conexão.
 * @async
 * @function connectDB
 * @returns {Promise<void>} Resolve quando a conexão for bem-sucedida.
 * @throws {Error} Lança um erro e encerra o processo se a conexão falhar.
 * @example
 * const connectDB = require('./config/database');
 * connectDB();
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Erro ao conectar ao MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
