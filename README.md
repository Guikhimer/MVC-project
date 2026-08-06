# Vitrine MVC

Aplicação monolítica MVC com Node.js, Express, EJS e MongoDB Atlas. O mesmo serviço aplica a regra de negócio, persiste dados e renderiza a interface no servidor.

## Recursos

- Interface responsiva renderizada com EJS.
- Catálogo de produtos persistido no MongoDB Atlas.
- Cadastro, login e logout de usuários.
- Senhas protegidas com Bcrypt.
- JWT armazenado em cookie `HTTP-only`; operações de criar, editar e remover produtos exigem autenticação.
- Headers básicos de segurança, limitação do corpo das requisições e rota de saúde.
- Configuração de deploy no Render em `render.yaml`.

## Executar localmente

```bash
npm ci
copy .env.example .env
npm start
```

O Atlas precisa aceitar o IP da sua rede em **Network Access**. Caso a rede bloqueie a porta de saída `27017`, use outra conexão, como hotspot de celular.

## Variáveis de ambiente

```env
MONGO_URI=mongodb+srv://USUARIO:SENHA@cluster0.exemplo.mongodb.net/mvc-project?retryWrites=true&w=majority
JWT_SECRET=gere_uma_chave_longa_e_aleatoria
JWT_EXPIRES_IN=7d
PORT=3000
NODE_ENV=development
```

Nunca versione ou compartilhe o arquivo `.env`. Para produção, use uma senha exclusiva do Atlas e uma `JWT_SECRET` diferente da usada localmente.

## Rotas principais

| Método | Rota | Descrição |
| --- | --- | --- |
| GET | `/` | Página inicial MVC |
| GET | `/api/products/view` | Catálogo renderizado |
| GET | `/auth/cadastro` | Tela de cadastro |
| GET | `/auth/login` | Tela de login |
| POST | `/auth/register` | Cria uma conta e inicia a sessão |
| POST | `/auth/login` | Inicia a sessão JWT |
| POST | `/auth/logout` | Encerra a sessão |
| GET | `/api/products` | Lista produtos em JSON |
| POST | `/api/products` | Cria produto (requer login) |
| PUT | `/api/products/:id` | Atualiza produto (requer login) |
| DELETE | `/api/products/:id` | Remove produto logicamente (requer login) |
| GET | `/health` | Health check do serviço |

## Deploy no Render

1. Envie o código para o GitHub.
2. No Render, crie um **Blueprint** a partir do repositório. O arquivo `render.yaml` define build, start e health check.
3. Em **Environment**, informe `MONGO_URI` com a URI do Atlas. O Render gera `JWT_SECRET` e define `NODE_ENV=production` automaticamente pelo blueprint.
4. No Atlas, mantenha uma regra de acesso que permita a conexão do Render. Para a atividade, `0.0.0.0/0` permite o acesso; em uma aplicação real, restrinja a regra à rede de produção.
5. Valide `https://SEU-SERVICO.onrender.com/health` após o deploy.
