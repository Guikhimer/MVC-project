require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');

const startServer = async () => {
  await connectDB();

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
  });
};

startServer();
