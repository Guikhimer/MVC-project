require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database');
const productRoutes = require('./routes/productRoutes');

const app = express();

// Middleware para parsing de JSON
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (req, res) => {
  res.render('index');
});

// Conexão com o banco de dados
connectDB();

// Rotas
app.use('/api/products', productRoutes);

// Rota de saúde da API
app.get('/', (req, res) => {
  res.json({ message: 'API MVC funcionando!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;
