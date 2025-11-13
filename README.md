# Projeto FullStack - Pronto para VS Code

Este pacote contém um backend (Node.js + Express + SQLite + JWT) e um frontend simples que já se conecta ao backend.

## Como usar

1. Baixe e descompacte `projeto-fullstack-ready.zip`.
2. Abra o VS Code na pasta `projeto-fullstack-ready`.
3. No terminal, entre em `backend`:
   - copie `.env.example` para `.env` e ajuste `JWT_SECRET` (escolha uma senha forte).
   - rode `npm install`
   - rode `npx knex migrate:latest` (cria o banco SQLite)
   - rode `npm run dev`
4. Abra `frontend/index.html` no navegador (pode abrir como arquivo estático ou servir com um servidor estático).
5. Teste cadastro, login e CRUD de serviços.

Boa sorte na apresentação!