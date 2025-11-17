const router = require('express').Router();
const db = require('../database/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET || 'troque_esta_chave_por_uma_senha_segura';

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
  try {
    const user = await db('users').where({ email }).first();
    if (!user) return res.status(404).json({ message: 'Email ou senha inválidos.' });
    const isPassCorrect = await bcrypt.compare(password, user.password_hash);
    if (!isPassCorrect) return res.status(401).json({ message: 'Email ou senha inválidos.' });
    const token = jwt.sign({ id: user.id, email: user.email }, secret, { expiresIn: '2h' });
    res.status(200).json({ message: 'Login bem-sucedido!', token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao fazer login.', error: error.message });
  }
});

module.exports = router;
