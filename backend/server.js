const express = require("express");
const cors = require("cors");
const knex = require("knex");
const bcrypt = require("bcryptjs");
const path = require("path");

const app = express();

app.use(express.json());
app.use(cors());

// ========================
// SERVIR FRONTEND
// ========================

app.use(express.static(path.join(__dirname, "../frontend")));


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// ========================
// BANCO DE DADOS
// ========================
const db = knex({
    client: "sqlite3",
    connection: {
        filename: "./database.sqlite"
    },
    useNullAsDefault: true
});

// Criar tabela users se não existir
db.schema.hasTable("users").then(exists => {
    if (!exists) {
        return db.schema.createTable("users", table => {
            table.increments("id").primary();
            table.string("username").unique().notNullable();
            table.string("password").notNullable();
        }).then(() => console.log("Tabela 'users' criada"));
    }
});

// ========================
// ROTA DE REGISTRO
// ========================
app.post("/register", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Dados incompletos" });
    }

    const hashed = await bcrypt.hash(password, 10);

    try {
        await db("users").insert({ username, password: hashed });
        res.json({ message: "Usuário registrado com sucesso" });
    } catch (err) {
        if (err.message.includes("UNIQUE")) {
            return res.status(400).json({ message: "Usuário já existe" });
        }
        res.status(500).json({ message: "Erro no servidor", error: err.message });
    }
});

// ========================
// ROTA DE LOGIN
// ========================
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const user = await db("users").where({ username }).first();
    if (!user) return res.status(400).json({ message: "Usuário não encontrado" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Senha incorreta" });

    res.json({ message: "Login realizado", userId: user.id });
});

// ========================
// INICIAR SERVIDOR
// ========================
const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
