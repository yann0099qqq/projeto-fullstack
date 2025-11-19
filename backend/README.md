# Backend - Projeto FullStack (Construtora LCI)

## O que tem aqui
- Node.js + Express
- Knex + SQLite (migrations)
- Rotas: /api/auth, /api/users, /api/services
- Autenticação JWT para rotas protegidas

## Passos para rodar localmente (no seu VS Code)

1. Copie `.env.example` para `.env` e ajuste as variáveis (especialmente JWT_SECRET).
2. Abra o terminal em `backend` e rode:
   - `npm install`
   - `npx knex migrate:latest`  (ou `npm run migrate`)
3. Para rodar em desenvolvimento:
   - `npm run dev`  (precisa do nodemon instalado como devDependency)
4. A API ficará disponível em `http://localhost:3001`

## Observações
- Endpoints protegidos exigem o header `Authorization: Bearer <token>`.
- O front-end entregue está configurado para consumir `http://localhost:3001`.
