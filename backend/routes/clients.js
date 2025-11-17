const express = require('express');
const knex = require('../database/knex');
const router = express.Router();

// list
router.get('/', async (req, res) => {
  const items = await knex('clients').select('*').orderBy('created_at','desc');
  res.json(items);
});

// get
router.get('/:id', async (req, res) => {
  const item = await knex('clients').where({ id: req.params.id }).first();
  if (!item) return res.status(404).json({ message: 'Não encontrado' });
  res.json(item);
});

// create
router.post('/', async (req, res) => {
  try {
    const [created] = await knex('clients').insert(req.body).returning('*');
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

// update
router.put('/:id', async (req, res) => {
  await knex('clients').where({ id: req.params.id }).update(req.body);
  const item = await knex('clients').where({ id: req.params.id }).first();
  res.json(item);
});

// delete
router.delete('/:id', async (req, res) => {
  await knex('clients').where({ id: req.params.id }).del();
  res.json({ message: 'Removido' });
});

module.exports = router;
