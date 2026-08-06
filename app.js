const path = require('path');
const express = require('express');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const storeRoutes = require('./routes/storeRoutes');
const { optionalAuth } = require('./middleware/auth');

const app = express();

app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Content-Security-Policy', "default-src 'self'; style-src 'self'; img-src 'self' data:; base-uri 'self'; form-action 'self'");
  next();
});
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(optionalAuth);

app.get('/', (req, res) => {
  res.render('index', { page: 'home' });
});

app.use('/auth', authRoutes);
app.use('/produtos', storeRoutes);
app.use('/api/products', productRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use((req, res) => {
  res.status(404).render('not-found', { page: 'not-found' });
});

module.exports = app;
