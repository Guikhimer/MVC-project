require('dotenv').config();
const express = require('express');
const connectDB = require('./src/config/db');

const app = express();

connectDB();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API rodando');
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});