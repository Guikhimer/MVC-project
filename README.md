# MVC Products

Aplicação monolítica MVC com Node.js, Express, EJS e MongoDB. O mesmo serviço processa a regra de negócio, acessa o banco de dados e renderiza as páginas HTML no servidor.

## Executar localmente

```bash
npm ci
copy .env.example .env
npm start
```

A aplicação estará disponível em `http://localhost:3000`.

- Página inicial: `/`
- Lista de produtos renderizada: `/api/products/view`
- API de produtos: `/api/products`
- Health check: `/health`

## Variáveis de ambiente

```env
MONGO_URI=mongodb://localhost:27017/mvc-project
JWT_SECRET=uma_chave_secreta_longa
PORT=3000
```

Nunca publique o arquivo `.env` ou a string de conexão do banco.

## Deploy no Render

O arquivo `render.yaml` já configura o serviço Node.js no Render.

1. Envie este código para um repositório público no GitHub.
2. No Render, crie um **Blueprint** apontando para o repositório.
3. Informe `MONGO_URI` no painel do Render com a string de conexão de um MongoDB em nuvem (por exemplo, MongoDB Atlas).
4. Após o deploy, valide `https://SEU-SERVICO.onrender.com/health` e a página inicial.

O Render usa `npm ci` para o build e `npm start` para iniciar a aplicação. A variável `PORT` é fornecida automaticamente pelo provedor.
