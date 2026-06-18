# 🛒 MVC Products API

![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.x-000000?style=flat&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat&logo=mongodb&logoColor=white)
![License](https://img.shields.io/badge/License-ISC-blue?style=flat)

API RESTful construída com Node.js e Express seguindo o padrão arquitetural **MVC (Model-View-Controller)**. O projeto gerencia um catálogo de produtos com operações completas de CRUD, autenticação via JWT e persistência de dados no MongoDB. A documentação interna foi produzida com **JSDoc**, garantindo IntelliSense no VS Code para toda a equipe.

---

## 🚀 Stack Tecnológica

- **[Node.js](https://nodejs.org/)** — Runtime JavaScript no servidor
- **[Express 5](https://expressjs.com/)** — Framework web minimalista e rápido
- **[MongoDB](https://www.mongodb.com/)** + **[Mongoose](https://mongoosejs.com/)** — Banco de dados NoSQL e ODM
- **[JSON Web Token (JWT)](https://jwt.io/)** — Autenticação stateless via tokens
- **[Bcrypt](https://github.com/kelektiv/node.bcrypt.js)** — Hash seguro de senhas
- **[Dotenv](https://github.com/motdotla/dotenv)** — Gerenciamento de variáveis de ambiente
- **[Nodemon](https://nodemon.io/)** — Reinicialização automática em desenvolvimento

---

## 📁 Estrutura do Projeto

```
mvc-project/
├── config/
│   └── database.js          # Configuração e conexão com o MongoDB
├── controllers/
│   └── productController.js # Lógica de negócio dos endpoints (JSDoc)
├── models/
│   └── Product.js           # Schema e métodos de persistência (JSDoc)
├── routes/
│   └── productRoutes.js     # Mapeamento de rotas HTTP
├── app.js                   # Ponto de entrada da aplicação
├── .env.example             # Exemplo de variáveis de ambiente
└── README.md
```

---

## ⚙️ Guia de Instalação e Execução

### Pré-requisitos

- [Node.js](https://nodejs.org/) v18 ou superior
- [MongoDB](https://www.mongodb.com/try/download/community) local **ou** uma conta no [MongoDB Atlas](https://www.mongodb.com/atlas)

### 1. Clone o repositório

```bash
git clone https://github.com/Guikhimer/MVC-project.git
cd MVC-project
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Abra o arquivo `.env` e preencha com os seus valores (veja a seção abaixo).

### 4. Inicie o servidor

```bash
# Modo desenvolvimento (com hot-reload via Nodemon)
npm run dev

# Modo produção
node app.js
```

O servidor estará disponível em `http://localhost:3000`.

---

## 🔐 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# String de conexão do MongoDB (local ou Atlas)
MONGO_URI=mongodb://localhost:27017/mvc-project

# Chave secreta para assinatura dos tokens JWT (use uma string longa e aleatória)
JWT_SECRET=sua_chave_secreta_aqui

# Porta do servidor (opcional, padrão: 3000)
PORT=3000
```

> ⚠️ **Nunca** compartilhe o arquivo `.env` real. Ele já está listado no `.gitignore`.

---

## 📡 Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/products` | Lista todos os produtos ativos |
| `GET` | `/api/products/:id` | Retorna um produto pelo ID |
| `POST` | `/api/products` | Cria um novo produto |
| `PUT` | `/api/products/:id` | Atualiza um produto pelo ID |
| `DELETE` | `/api/products/:id` | Remove um produto (soft delete) |

### Exemplo de body para `POST /api/products`

```json
{
  "name": "Tênis Runner Pro",
  "description": "Tênis leve para corridas de longa distância",
  "price": 299.90,
  "stock": 50
}
```

---

## 👨‍💻 Autor

Desenvolvido durante o curso de desenvolvimento Back-end.
