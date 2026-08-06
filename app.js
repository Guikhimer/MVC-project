const express = require('express');
const productRoutes = require('./routes/productRoutes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (req, res) => {
  res.render('index');
});

app.use('/api/products', productRoutes);

// Endpoint usado pelo provedor de hospedagem para verificar a aplicação.
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

module.exports = app;
