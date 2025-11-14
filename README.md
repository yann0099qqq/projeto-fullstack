# Projeto FullStack


Aplicação Full Stack composta por **frontend estático (HTML/CSS/JS)** e **backend em Node.js + Express + Knex**, incluindo integração com banco de dados, rotas organizadas e interface visual estruturada.

## 📂 Estrutura do Projeto

```
Projeto-FullStack/
│
├── backend/
│   ├── server.js                # Servidor Express
│   ├── routes/                  # Rotas da aplicação
│   ├── middleware/              # Middlewares (ex.: autenticação)
│   ├── database/                # Configurações e migrations
│   ├── knexfile.js              # Configuração do Knex
│   ├── package.json
│   └── .env.example             # Variáveis de ambiente
│
├── frontend/
│   ├── index.html               # Página inicial
│   ├── dashboard.html           # Tela interna
│   ├── css/                     # Estilos
│   ├── js/                      # Scripts do frontend
│   └── imagens/                 # Assets
│
├── index.html                   # página raiz (versão pública)
├── css/                         # estilos globais
├── js/                          # scripts globais
└── imagens/                     # imagens globais
```

## 🚀 Tecnologias Utilizadas

### Frontend
- HTML5  
- CSS3  
- JavaScript  
- Layout responsivo

### Backend
- Node.js  
- Express  
- Knex.js  
- Banco de dados configurável via .env  

## ⚙️ Instalação e Execução

### 1. Backend

```bash
cd backend
npm install
```

Crie o arquivo `.env` com:

```
PORT=3000
DATABASE_CLIENT=sqlite3
DATABASE_FILENAME=./database/db.sqlite
```

Inicie:

```bash
npm start
```

### 2. Frontend
Basta abrir:

```
frontend/index.html
```

## 📌 Funcionalidades Principais
- Estrutura modular  
- API com Express  
- Integração com banco  
- Interface organizada  

## 🤝 Contribuição

1. Fork  
2. Branch: `git checkout -b feature/minha-feature`  
3. Commit  
4. Push  
5. Pull Request  

4. Push  
5. Pull Request  

Autores: Ian Antonio Santos / Gabriel Pedrosa Castro / Gabriel Augusto Barbosa
