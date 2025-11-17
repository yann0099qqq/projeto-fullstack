const express = require('express');
const knex = require('../database/knex');
const router = express.Router();
const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: 'Sem token' });
  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'change_this');
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido' });
  }
}

// list
router.get('/', auth, async (req, res) => {
  const users = await knex('users').select('id','name','email','phone','created_at');
  res.json(users);
});

// get by id
router.get('/:id', auth, async (req, res) => {
  const user = await knex('users').where({ id: req.params.id }).first().select('id','name','email','phone','created_at');
  if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });
  res.json(user);
});

// update
router.put('/:id', auth, async (req, res) => {
  const { name, phone } = req.body;
  await knex('users').where({ id: req.params.id }).update({ name, phone, updated_at: knex.fn.now() });
  const user = await knex('users').where({ id: req.params.id }).first().select('id','name','email','phone','created_at');
  res.json(user);
});

// delete
router.delete('/:id', auth, async (req, res) => {
  await knex('users').where({ id: req.params.id }).del();
  res.json({ message: 'Removido' });
});

module.exports = router;
