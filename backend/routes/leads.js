const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'troque_esta_chave_para_uma_secreta';

// create lead (public)
router.post('/', async (req, res, next) => {
  try {
    const db = req.db;
    const { name, email, phone, message } = req.body;
    if (!name || !email || !message) return res.status(400).json({ error: 'name, email and message are required' });
    const [id] = await db('leads').insert({ name, email, phone, message });
    const lead = await db('leads').where({ id }).first();
    res.status(201).json({ lead });
  } catch (err) { next(err); }
});

// middleware to protect routes
function authenticate(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Token não fornecido' });
  const parts = auth.split(' ');
  if (parts.length !== 2) return res.status(401).json({ error: 'Token inválido' });
  const token = parts[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
}

// list leads (protected - for dashboard)
router.get('/', authenticate, async (req, res, next) => {
  try {
    const db = req.db;
    const leads = await db('leads').orderBy('created_at', 'desc');
    res.json({ leads });
  } catch (err) { next(err); }
});

module.exports = router;
