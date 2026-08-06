const assert = require('node:assert/strict');
const http = require('node:http');
const test = require('node:test');
const app = require('../app');
const Product = require('../models/Product');

const request = (path) => new Promise((resolve, reject) => {
  const server = http.createServer(app);
  server.listen(0, '127.0.0.1', () => {
    const { port } = server.address();
    http.get({ host: '127.0.0.1', port, path }, (response) => {
      let body = '';
      response.setEncoding('utf8');
      response.on('data', (chunk) => { body += chunk; });
      response.on('end', () => server.close(() => resolve({ response, body })));
    }).on('error', (error) => server.close(() => reject(error)));
  });
});

test('modelo expõe os métodos de persistência', () => {
  assert.equal(typeof Product.findAll, 'function');
  assert.equal(typeof Product.createProduct, 'function');
  assert.equal(typeof Product.updateProduct, 'function');
  assert.equal(typeof Product.softDelete, 'function');
});

test('a aplicação responde ao health check sem conexão externa', async () => {
  const { response, body } = await request('/health');
  assert.equal(response.statusCode, 200);
  assert.deepEqual(JSON.parse(body), { status: 'ok' });
});

test('a rota inicial exige login', async () => {
  const { response } = await request('/');
  assert.equal(response.statusCode, 302);
  assert.equal(response.headers.location, '/auth/login');
});

test('a página de login fica disponível sem conexão de banco', async () => {
  const { response, body } = await request('/auth/login');
  assert.equal(response.statusCode, 200);
  assert.match(body, /Boas-vindas/);
});

test('a tela de cadastro de produto pede login', async () => {
  const { response } = await request('/produtos/novo');
  assert.equal(response.statusCode, 302);
  assert.equal(response.headers.location, '/auth/login');
});
