const router = require('express').Router();
const db = require('../database/db');
const bcrypt = require('bcryptjs');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/users => cadastro
router.post('/', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'Nome, email e senha são obrigatórios.' });
  try {
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    const [id] = await db('users').insert({ name, email, password_hash });
    res.status(201).json({ id, name, email });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao cadastrar usuário.', error: error.message });
  }
});

// GET /api/users => lista (protegido)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const users = await db('users').select('id', 'name', 'email', 'created_at');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar usuários.', error: error.message });
  }
});

// PUT /api/users/:id => atualizar (protegido)
router.put('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  try {
    const count = await db('users').where({ id }).update({ name, email, updated_at: db.fn.now() });
    if (count === 0) return res.status(404).json({ message: 'Usuário não encontrado.' });
    const user = await db('users').where({ id }).select('id', 'name', 'email').first();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar usuário.', error: error.message });
  }
});

// DELETE /api/users/:id => deletar (protegido)
router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const count = await db('users').where({ id }).del();
    if (count === 0) return res.status(404).json({ message: 'Usuário não encontrado.' });
    res.status(200).json({ message: 'Usuário deletado com sucesso.' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar usuário.', error: error.message });
  }
});

module.exports = router;
