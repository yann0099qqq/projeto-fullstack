# Backend - Construtora LCI

Backend em Node.js + Express + Knex + SQLite3 para autenticação de usuários e gerenciamento de leads (perguntas).

## Como usar

1. Copie `.env.example` para `.env` e ajuste se quiser:
```
PORT=3000
JWT_SECRET=troque_esta_chave_para_uma_secreta
DB_FILENAME=./dev.sqlite3
```

2. Instale dependências:
```
npm install
```

3. Rode as migrations:
```
npx knex --knexfile knexfile.js migrate:latest
```

4. Inicie o servidor:
```
npm run dev
```

## Endpoints principais

- `POST /users/register` — cadastrar usuário  
  Body JSON: `{ "name":"...", "email":"...", "password":"..." }`

- `POST /users/login` — autenticar  
  Body JSON: `{ "email":"...", "password":"..." }`  
  Response: `{ user, token }`

- `POST /leads` — enviar pergunta (público)  
  Body JSON: `{ "name":"...", "email":"...", "phone":"", "message":"..." }`

- `GET /leads` — listar perguntas (protegido: enviar header Authorization: Bearer <token>)

